const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// POST /api/match  — find complementary skill matches for the current user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select('-password');
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const allUsers = await User.find({ _id: { $ne: req.user.id } }).select('-password');

    const normalize = (arr) => (arr || []).map(s => s.toLowerCase().trim());

    const myOffered = normalize(currentUser.skillsOffered);
    const myWanted = normalize(currentUser.skillsWanted);

    const matches = allUsers
      .map(other => {
        const theirOffered = normalize(other.skillsOffered);
        const theirWanted = normalize(other.skillsWanted);

        // Skills this user can learn from the other
        const canLearn = myWanted.filter(s => theirOffered.includes(s));
        // Skills the other can learn from this user
        const canTeach = theirWanted.filter(s => myOffered.includes(s));

        const matchScore = canLearn.length + canTeach.length;

        return { user: other, canLearn, canTeach, matchScore };
      })
      .filter(m => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
