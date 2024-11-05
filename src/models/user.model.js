const mongoose = require('mongoose');
const { cryptPassword } = require("../utils/passwordCrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  type: { type: String, default: 'user' },
  otp: { type: Number, default: null },
  otpVerify: { type: Boolean, default: false },
},{ timestamps: true });

// Pre-save middleware to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await cryptPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);