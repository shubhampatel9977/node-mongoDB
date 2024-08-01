const Joi = require('joi');

const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  type: Joi.string().valid('user', 'admin'),
});

const logInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const otpVerifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().integer().min(100000).max(999999).required(),
});

const setNewPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.ref('password'),
});

module.exports = {
  signUpSchema,
  logInSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  otpVerifySchema,
  setNewPasswordSchema,
};