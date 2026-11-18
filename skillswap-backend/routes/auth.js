const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted, availability } = req.body;
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8)
      return res.status(400).json({ message: 'Enter a name, valid email, and password of at least 8 characters' });
    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password, skillsOffered: Array.isArray(skillsOffered) ? skillsOffered : [], skillsWanted: Array.isArray(skillsWanted) ? skillsWanted : [], availability: availability || {} });
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, skillsOffered: user.skillsOffered, skillsWanted: user.skillsWanted, availability: user.availability }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string')
      return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, skillsOffered: user.skillsOffered, skillsWanted: user.skillsWanted, availability: user.availability, bio: user.bio, avatar: user.avatar }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
