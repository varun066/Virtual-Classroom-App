const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: String,
  rollNumber: String
});

module.exports = mongoose.model('admins', adminSchema);
