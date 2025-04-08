const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  periods: { type: Number, required: true }, // Added field

});

module.exports = mongoose.model('Subject', subjectSchema);
