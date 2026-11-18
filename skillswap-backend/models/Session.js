const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  skillTopic: { type: String, default: '' },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  meetLink: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
