const express = require('express');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Testimonial.find();
  res.json({ testimonials: items });
});

router.post('/', auth, async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    res.json({ testimonial: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete testimonial
router.delete('/:id', auth, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update testimonial
router.put('/:id', auth, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ testimonial: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
