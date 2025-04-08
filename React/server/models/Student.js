const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: String,
  rollNumber: String,
  isApproved: {
    type: Boolean,
    default: false
  }
});



module.exports = mongoose.model('students', studentSchema);
