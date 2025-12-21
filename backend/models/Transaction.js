const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  phone: { type: String },
  courseName: { type: String },
  amount: { type: Number },
  currency: { type: String, default: 'INR' },
  provider: { type: String, enum: ['razorpay','demo','other'], default: 'demo' },
  orderId: { type: String },
  paymentId: { type: String },
  meta: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
