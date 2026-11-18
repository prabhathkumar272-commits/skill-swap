const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const authMiddleware = require('../middleware/auth');

// GET /api/requests — get all requests for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
    })
      .populate('senderId', 'name email skillsOffered skillsWanted avatar')
      .populate('receiverId', 'name email skillsOffered skillsWanted avatar')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/requests — send a swap request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, skillOffered, skillRequested, message } = req.body;
    if (!receiverId || receiverId === req.user.id || !skillOffered?.trim() || !skillRequested?.trim())
      return res.status(400).json({ message: 'Choose another student and provide both skills' });
    // Prevent duplicate pending request
    const existing = await Request.findOne({ senderId: req.user.id, receiverId, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'You already have a pending request with this user' });

    const request = await Request.create({ senderId: req.user.id, receiverId, skillOffered, skillRequested, message });
    const populated = await request.populate([
      { path: 'senderId', select: 'name email avatar' },
      { path: 'receiverId', select: 'name email avatar' }
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/requests/:id — accept or reject a request
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status))
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.receiverId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });
    request.status = status;
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
