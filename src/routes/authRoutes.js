const express = require("express");
const { authorize } = require("../middleware/authorization");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Define routes
router.post('/signUp', authController.signUpController);
router.post('/logIn', authController.logInController);
router.post('/refreshToken', authController.refreshTokenController);
router.post('/forgotPassword', authController.forgotPasswordController);
router.post('/otpVerify', authController.otpVerifyController);
router.post('/setNewPassword', authController.setNewPasswordController);
router.post('/logout', authController.logoutController);

module.exports = router;