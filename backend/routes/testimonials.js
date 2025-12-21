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

module.exports = router;
