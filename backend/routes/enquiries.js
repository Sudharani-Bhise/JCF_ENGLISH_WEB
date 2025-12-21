const { Router } = require('express');
const client = require('../utils/twilioClient');
const Enquiry = require('../models/Enquiry');

const router = Router();

// Create a new enquiry
router.post('/', async (req, res) => {
  try {
    const e = await Enquiry.create(req.body);
    await client.messages.create({
      body: `New Enquiry from ${e.name} (${e.email || e.phone}): ${e.message}`,
      from: '+19894677451',
      to: '+918668307364'
    });
    res.status(201).json(e);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all enquiries (for admin)
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an enquiry (for admin)
router.delete('/:id', async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
