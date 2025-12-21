const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  type: { type: String, enum: ['student','teacher','testimonial','performance','other'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
