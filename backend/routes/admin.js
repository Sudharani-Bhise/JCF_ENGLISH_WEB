const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Testimonial = require('../models/Testimonial');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// middleware to allow only admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

// List users
router.get('/users', auth, requireAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ users });
});

// Delete user
router.delete('/users/:id', auth, requireAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Create course
router.post('/courses', auth, requireAdmin, async (req, res) => {
  const c = await Course.create(req.body);
  res.json({ course: c });
});

// List courses (admin)
router.get('/courses', auth, requireAdmin, async (req, res) => {
  const courses = await Course.find();
  res.json({ courses });
});

// Update course (admin)
router.put('/courses/:id', auth, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete course (admin)
router.delete('/courses/:id', auth, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add testimonial
router.post('/testimonials', auth, requireAdmin, async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    res.json({ testimonial: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List testimonials (admin)
router.get('/testimonials', auth, requireAdmin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json({ testimonials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete testimonial (admin)
router.delete('/testimonials/:id', auth, requireAdmin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase(), role: "admin" });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'change_this_secret',
      { expiresIn: '7d' }
    );
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, courses: user.courses },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update admin profile (name and/or password)
router.put('/profile', auth, requireAdmin, async (req, res) => {
  const { name, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;

    if (newPassword) {
      if (!oldPassword) return res.status(400).json({ message: 'Old password required to set a new password' });

      const ok = await bcrypt.compare(oldPassword, user.password);
      if (!ok) return res.status(400).json({ message: 'Old password is incorrect' });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ user: userObj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot password (request OTP)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'admin' });
    if (!user) return res.status(400).json({ message: 'No admin found with that email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // If Twilio is configured and user has phone, send SMS. Otherwise, for demo, log the OTP.
    try {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && user.phone) {
        const twilioClient = require('../utils/twilioClient');
        await twilioClient.messages.create({
          body: `Your admin password reset OTP is ${otp}`,
          from: process.env.TWILIO_FROM || '+1234567890',
          to: user.phone
        });
      } else {
        console.log(`OTP for ${user.email}: ${otp}`);
      }
    } catch (sendErr) {
      console.error('Failed to send OTP:', sendErr.message);
    }

    // In development or if DEBUG_OTP=true, return the otp in response to simplify testing
    const responseBody = { message: 'OTP sent' };
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_OTP === 'true') responseBody.otp = otp;

    res.json(responseBody);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset password with OTP
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Email, OTP and newPassword are required' });

    const user = await User.findOne({ email: email.trim().toLowerCase(), role: 'admin' });
    if (!user) return res.status(400).json({ message: 'Invalid request' });

    if (!user.otp || user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (!user.otpExpires || user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List transactions (admin)
router.get('/transactions', auth, requireAdmin, async (req, res) => {
  try {
    const Transaction = require('../models/Transaction');
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search transactions by email or course (admin)
router.get('/transactions/search', auth, requireAdmin, async (req, res) => {
  try {
    const { q } = req.query;
    const Transaction = require('../models/Transaction');
    const transactions = await Transaction.find({
      $or: [
        { email: { $regex: q, $options: 'i' } },
        { courseName: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only config check (no secrets returned) - helpful to verify keys are set
router.get('/config', auth, requireAdmin, (req, res) => {
  const config = {
    razorpay: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM),
    smtp: !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST),
    debugOtp: process.env.DEBUG_OTP === 'true'
  };
  res.json({ config });
});

module.exports = router;
