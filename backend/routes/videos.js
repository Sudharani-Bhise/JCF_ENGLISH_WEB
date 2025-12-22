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

// Admin: create video (supports both URL and base64 file data)
router.post('/', auth, requireAdmin, async (req, res) => {
  const { title, description, url, type, fileData } = req.body;
  try {
    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!url && !fileData) return res.status(400).json({ message: 'Video URL or file is required' });
    
    // If fileData is provided (base64 encoded), use it. Otherwise use URL
    const videoUrl = fileData || url;
    
    const v = await Video.create({ 
      title, 
      description, 
      url: videoUrl, 
      type,
      isBase64: !!fileData // Mark if it's base64 encoded
    });
    res.json({ video: v });
  } catch (err) {
    // If error is due to size, give helpful message
    if (err.message.includes('16777216') || err.message.includes('too large')) {
      return res.status(400).json({ message: 'File too large. Please use a smaller video file (max ~10MB)' });
    }
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
