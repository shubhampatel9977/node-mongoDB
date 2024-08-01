const userModel = require("../models/userModel");

const signInService = async (payload) => {
  try {
    const add = new userModel(payload);
    const sighIn = await add.save();
    return sighIn;
  } catch (error) {
    console.error("Something wrong in signInService", error?.message);
  }
};

const logInService = async (data) => {
  try {
      const userData = await userModel.findOne({ email: data });
      return userData;
  } catch (error) {
    console.error("Something wrong in logInService", error?.message);
  }
};

const saveRefreshToken = async (userId, refreshToken) => {
  try {
    await userModel.updateOne({ _id: userId }, { $set: { refreshToken } });
  } catch (error) {
    console.error("Something wrong in saveRefreshToken", error?.message);
  }
}

const saveOtp = async (userId, otp) => {
  try {
    await userModel.updateOne({ _id: userId }, { $set: { otp } });
  } catch (error) {
    console.error("Something wrong in saveOtp", error?.message);
  }
}

const otpVerifyService = async (email, otp) => {
  try {
      const userData = await userModel.findOne({ email, otp });
      return userData;
  } catch (error) {
    console.error("Something wrong in otpVerifyService", error?.message);
  }
};

const saveNewPassword = async (userId, password) => {
  try {
    await userModel.updateOne({ _id: userId }, { $set: { password } });
  } catch (error) {
    console.error("Something wrong in saveNewPassword", error?.message);
  }
}

module.exports = {
  signInService,
  logInService,
  saveRefreshToken,
  saveOtp,
  otpVerifyService,
  saveNewPassword,
};
