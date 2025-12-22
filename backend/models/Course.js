const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: String },
  price: { type: Number },
  level: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
