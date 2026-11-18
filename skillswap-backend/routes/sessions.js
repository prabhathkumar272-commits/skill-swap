const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');

// GET /api/sessions — sessions for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ users: req.user.id })
      .populate('users', 'name email avatar')
      .populate('requestId')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/sessions — book a session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { requestId, users, skillTopic, date, timeSlot, meetLink, notes } = req.body;
    if (!Array.isArray(users) || users.length !== 2 || !users.includes(req.user.id))
      return res.status(400).json({ message: 'A session must include you and one other participant' });
    if (users[0] === users[1]) return res.status(400).json({ message: 'A session needs two different participants' });
    const session = await Session.create({ requestId, users, skillTopic, date, timeSlot, meetLink, notes });
    const populated = await session.populate('users', 'name email avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/sessions/:id — update session status
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'completed', 'cancelled'].includes(status))
      return res.status(400).json({ message: 'Invalid session status' });
    const session = await Session.findOne({ _id: req.params.id, users: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.status = status;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
