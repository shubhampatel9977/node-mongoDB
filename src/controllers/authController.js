const authValidation = require("../validations/authValidation");
const userModel = require("../models/userModel");
const authService = require("../services/authServies");
const { cryptPassword, comparePassword } = require("../utils/passwordCrypt");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../middleware/authorization");
const { ApiSuccess, ApiError } = require("../utils/ApiResponse");
const { randomNumberDigits } = require("../utils/generateRandomNumber");
const sendEmail = require("../utils/emailSender");
const sendOtpTemplate  = require("../utils/Email Template/sendOtpTemplate");

const signUpController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.signUpSchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Check if the email already exists in the database
    const existingUser = await userModel.findOne({ email: value.email });
    if (existingUser && existingUser?.otpVerify === true)
      return ApiSuccess(res, 200, false, "Email already exists");

    // Hash the password before saving
    const hashPass = await cryptPassword(value.password);
    value.password = hashPass;

    // Otp ganrate and save in document
    const otp = randomNumberDigits(6);
    value.otp = otp;

    // Send otp mail to user
    sendEmail(value.email, "OTP Varification", '', sendOtpTemplate(otp));

    if(existingUser && existingUser?.otpVerify === false){
      // Update User
      const userData = await authService.signInUpdateService(value);

      if (userData)
        return ApiSuccess(res, 200, true, "User Register please verify your OTP!")

    } else {
      // Save User
      const userData = await authService.signInService(value);

      if (userData)
        return ApiSuccess(res, 200, true, "User Register please verify your OTP!")
    }

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const logInController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.logInSchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Find User
    const userData = await authService.logInService(value.email);

    if (userData) {
      // Password Maching
      const verifyPass = await comparePassword(value.password, userData.password);
      if (!verifyPass)
        return ApiSuccess(res, 200, false, "Invalid Email or Password");

      const payload = {
        userId: userData._id,
        type: userData.type,
      };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      // Save refresh token to user document
      await authService.saveRefreshToken(userData._id, refreshToken);

      const userInfo = {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        type: userData.type,
        otpVerify: userData.otpVerify,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };

      return ApiSuccess(res, 200, true, "User Login Successfully", { accessToken, refreshToken, userInfo })

    } else {
      return ApiSuccess(res, 200, false, "Invalid Email or Password");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const refreshTokenController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.refreshTokenSchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Verify Refresh Token
    const userData = await verifyRefreshToken(value.refreshToken);

    if (userData?.error)
      return ApiError(res, 403, "Forbidden - Refresh token invalid or expire, please login again");

    // Generate Access Token 
    const accessToken = await generateAccessToken(userData?.userInfo);

    return ApiSuccess(res, 200, true, "Create Access Token Successfully", { accessToken })

  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.forgotPasswordSchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Find User
    const userData = await authService.logInService(value.email);

    if (userData) {
      const otp = randomNumberDigits(6);

      // Save otp to user document
      await authService.saveOtp(userData._id, otp);

      // Send Mail to user 
      await sendEmail(userData.email, "OTP Varification", '', sendOtpTemplate(otp));

      return ApiSuccess(res, 200, true, "Send OTP your register email address");

    } else {
      return ApiSuccess(res, 200, false, "Invalid Email");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const otpVerifyController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.otpVerifySchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Find User
    const userData = await authService.otpVerifyService(value.email, parseInt(value.otp));

    if (userData) {
      return ApiSuccess(res, 200, true, "OTP verify successfully");
    } else {
      return ApiSuccess(res, 200, false, "Invalid OTP");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
};

const setNewPasswordController = async (req, res) => {
  try {
    // Check Validation
    const { error, value } = authValidation.setNewPasswordSchema.validate(req.body);
    if (error)
      return ApiError(res, 400, error.details[0].message);

    // Find User
    const userData = await authService.logInService(value.email);

    if (userData) {
      // Hash the password before saving
      const hashPass = await cryptPassword(value.password);

      // Save refresh token to user document
      await authService.saveNewPassword(userData._id, hashPass);

      return ApiSuccess(res, 200, true, "Password update sucessflly");
    } else {
      return ApiSuccess(res, 200, false, "Invalid Email");
    }
  } catch (error) {
    return ApiError(res, 500, error?.message);
  }
}

module.exports = {
  signUpController,
  logInController,
  refreshTokenController,
  forgotPasswordController,
  otpVerifyController,
  setNewPasswordController,
};
