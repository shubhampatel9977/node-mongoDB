const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  college: { type: String, require: true },
  description: { type: String, required: true },
  profile: { type: String },
},{ timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
