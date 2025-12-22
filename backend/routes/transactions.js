const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const router = express.Router();

// middleware to allow only admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

// List transactions (admin) with basic filtering
router.get('/', auth, requireAdmin, async (req, res) => {
  const { q, provider, course, from, to } = req.query;
  const filter = {};
  if (provider) filter.provider = provider;
  if (course) filter.courseName = course;
  if (q) filter.$or = [{ email: new RegExp(q, 'i') }, { courseName: new RegExp(q, 'i') }];
  if (from || to) filter.createdAt = {};
  if (from) filter.createdAt.$gte = new Date(from);
  if (to) filter.createdAt.$lte = new Date(to);

  try {
    const txs = await Transaction.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ transactions: txs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete transaction (admin)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const tx = await Transaction.findByIdAndDelete(req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
