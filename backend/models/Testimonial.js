const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: String,
  text: String,
  message: String,  // Legacy field
  img: String,  // Image (base64 or URL)
  rating: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
