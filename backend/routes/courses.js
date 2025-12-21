const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json({ courses });
});

// Enroll (requires auth)
router.post('/enroll', auth, async (req, res) => {
  const { courseName, payment } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.courses.includes(courseName)) {
      user.courses.push(courseName);
      await user.save();
    }

    // Create a transaction record for this enrollment (demo-mode if no payment info)
    try {
      const Transaction = require('../models/Transaction');
      const tx = await Transaction.create({
        user: user._id,
        email: user.email,
        phone: user.phone,
        courseName,
        amount: payment?.amount || 0,
        provider: payment?.provider || 'demo',
        orderId: payment?.orderId
      });

      // Send confirmation SMS/email when enrolled
      // SMS via Twilio if configured and user.phone exists
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && user.phone) {
        const twilioClient = require('../utils/twilioClient');
        await twilioClient.messages.create({
          body: `You are successfully enrolled in ${courseName}. Thank you for enrolling!`,
          from: process.env.TWILIO_FROM || '+1234567890',
          to: user.phone
        });
      } else {
        console.log(`Enrollment confirmation (SMS) for ${user.email}: enrolled in ${courseName}`);
      }

      // Email via nodemailer if configured
      const sendMail = require('../utils/mailer');
      await sendMail({
        to: user.email,
        subject: `Enrollment confirmed: ${courseName}`,
        text: `Hi ${user.name},\n\nYou have been successfully enrolled in ${courseName}. Thank you!\n\nRegards, JCF Institute`
      });
    } catch (notifyErr) {
      console.error('Enrollment notification or transaction error:', notifyErr.message);
    }

    res.json({ message: 'Enrolled', courses: user.courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
