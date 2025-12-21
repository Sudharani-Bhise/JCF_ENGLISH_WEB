const express = require('express');
const router = express.Router();

// Create a demo or real order
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  try {
    // If DEMO_PAYMENTS=true we always return a demo order (no real gateway calls)
    if (process.env.DEMO_PAYMENTS === 'true') {
      const order = { id: `order_demo_${Date.now()}`, amount: Math.round((amount || 1) * 100), currency, receipt: receipt || `rcpt_${Date.now()}` };
      return res.json({ order, demo: true });
    }

    // Otherwise, if real Razorpay keys are configured and package is available, create real order
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const Razorpay = require('razorpay');
        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        const order = await instance.orders.create({ amount: Math.round((amount || 1) * 100), currency, receipt: receipt || `rcpt_${Date.now()}` });
        return res.json({ order });
      } catch (err) {
        console.error('Razorpay create error:', err.message);
      }
    }

    // Fallback demo order
    const order = { id: `order_demo_${Date.now()}`, amount: Math.round((amount || 1) * 100), currency, receipt: receipt || `rcpt_${Date.now()}` };
    res.json({ order, demo: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify payment (for real integration)
router.post('/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, demo, userId, email, phone, amount, courseName } = req.body;
  try {
    const Transaction = require('../models/Transaction');

    // demo path or missing secret -> accept as demo
    if (demo || !process.env.RAZORPAY_KEY_SECRET) {
      // create transaction record in demo mode
      await Transaction.create({ user: userId, email, phone, courseName, amount, provider: 'demo', orderId: razorpay_order_id || `order_demo_${Date.now()}` });
      return res.json({ ok: true, demo: true });
    }

    const crypto = require('crypto');
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // create a transaction record for successful payment
      await Transaction.create({ user: userId, email, phone, courseName, amount, provider: 'razorpay', orderId: razorpay_order_id, paymentId: razorpay_payment_id });
      return res.json({ ok: true });
    }
    return res.status(400).json({ ok: false, message: 'Invalid signature' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
