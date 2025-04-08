import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  links: [String], // Optional external links
  files: [String], // Array of uploaded file paths
  uploadedAt: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
