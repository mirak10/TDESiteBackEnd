const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const authenticateToken = require('../middleware/authenticate');

// 🔓 GET all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// 🔐 POST a new event (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, shortDescription, fullDetails, date, time, imageUrl } = req.body;
    const newEvent = new Event({ title, shortDescription, fullDetails, date, time, imageUrl });
    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event' });
  }
});

// ✏️ PUT/update an event (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Event updated', event: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event' });
  }
});

// 🗑️ DELETE an event (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event' });
  }
});

module.exports = router;
