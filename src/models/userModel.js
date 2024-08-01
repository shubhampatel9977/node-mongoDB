const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  type: { type: String, default: 'user' },
  refreshToken: { type: String, default: '' },
  otp: { type: Number, default: null },
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);