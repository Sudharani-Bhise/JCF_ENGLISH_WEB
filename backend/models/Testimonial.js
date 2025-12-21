const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: String,
  message: String,
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
