const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Video = require('../models/Video');

const router = express.Router();

// middleware to allow only admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

// Public: list videos, optional ?type=student|teacher|performance
router.get('/', async (req, res) => {
  const { type } = req.query;
  const filter = {};
  if (type) filter.type = type;
  try {
    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json({ videos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create video
router.post('/', auth, requireAdmin, async (req, res) => {
  const { title, description, url, type } = req.body;
  try {
    if (!title || !url) return res.status(400).json({ message: 'Title and URL are required' });
    const v = await Video.create({ title, description, url, type });
    res.json({ video: v });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete video
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
