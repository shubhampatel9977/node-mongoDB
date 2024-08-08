const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Define routes
router.post('/signUp', authController.signUpController);
router.post('/logIn', authController.logInController);
router.post('/refreshToken', authController.refreshTokenController);
router.post('/forgotPassword', authController.forgotPasswordController);
router.post('/otpVerify', authController.otpVerifyController);
router.post('/setNewPassword', authController.setNewPasswordController);

module.exports = router;