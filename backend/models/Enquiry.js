const { Schema, model } = require('mongoose');

const EnquirySchema = new Schema({
  name: String,
  email: String,
  message: String
}, { timestamps: true });

module.exports = model('Enquiry', EnquirySchema);
