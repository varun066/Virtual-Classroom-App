const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  files: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  announcedBy: { type: String, required: true } // changed from adminName to announcedBy
});

module.exports = mongoose.model('Announcement', announcementSchema);
