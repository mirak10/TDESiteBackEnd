const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const authenticateToken = require('../middleware/authenticate'); // assuming this exists

// 🚀 GET all team members (public)
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team members.' });
  }
});

// ➕ POST a new team member (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, position, imageUrl } = req.body;
    const newMember = new TeamMember({ name, position, imageUrl });
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add team member.' });
  }
});

// ✏️ PUT - Update a team member (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMember);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update team member.' });
  }
});

// ❌ DELETE - Remove a team member (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete team member.' });
  }
});

module.exports = router;
