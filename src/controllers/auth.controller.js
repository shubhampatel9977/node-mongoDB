const authValidation = require("../validations/authValidation");
const userModel = require("../models/user.model");
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
      return ApiError(res, 409, "Email already exists");

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
      await userModel.updateOne({ email: value?.email }, { $set: value });

      return ApiSuccess(res, 200, true, "User Register please verify your OTP!")

    } else {
      // Save User
      const addStudent = new userModel(value);
      await addStudent.save();

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
    const userData = await userModel.findOne({ email: value.email, otpVerify: true });

    if (userData) {
      // Password Maching
      const verifyPass = await comparePassword(value.password, userData.password);
      if (!verifyPass)
        return ApiError(res, 401, "Invalid Email or Password");

      const payload = {
        userId: userData._id,
        type: userData.type,
      };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      // Save refresh token to user document
      await userModel.updateOne({ _id: userData._id }, { $set: { refreshToken } });

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
      return ApiError(res, 401, "Invalid Email or Password");
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
      return ApiError(res, 401, "Forbidden - Refresh token invalid or expire, please login again");

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
    const userData = await userModel.findOne({ email: value.email, otpVerify: true });
    
    if (userData) {
      const otp = randomNumberDigits(6);

      // Save otp to user document
      await userModel.updateOne({ _id: userData._id }, { $set: { otp } });

      // Send Mail to user 
      await sendEmail(userData.email, "OTP Varification", '', sendOtpTemplate(otp));

      return ApiSuccess(res, 200, true, "Send OTP your register email address");

    } else {
      return ApiError(res, 400, "Invalid Email");
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
    const userData = await userModel.findOne({ email: value.email, otp: parseInt(value.otp) });

    if (userData) {
      await userModel.updateOne({ _id: userData._id }, { $set: { otpVerify: true } });

      return ApiSuccess(res, 200, true, "OTP verify successfully");
    } else {
      return ApiError(res, 400, "Invalid OTP");
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
    const userData = await userModel.findOne({ email: value.email, otpVerify: true });

    if (userData) {
      // Hash the password before saving
      const hashPass = await cryptPassword(value.password);

      // Save refresh token to user document
      await userModel.updateOne({ _id: userData._id }, { $set: { password: hashPass } });

      return ApiSuccess(res, 200, true, "Password update sucessflly");
    } else {
      return ApiError(res, 400, "Invalid Email");
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
