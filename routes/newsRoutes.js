const express = require('express');
const router = express.Router();
const News = require('../models/News');
const authenticateToken = require('../middleware/authenticate');

// 📰 Get all news (Public)
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ time: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

// 🧑‍💻 Add news (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();
    res.status(201).json({ message: 'News added', news: newNews });
  } catch (err) {
    res.status(500).json({ message: 'Error adding news' });
  }
});

// 🛠️ Update news (Protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'News updated', news: updatedNews });
  } catch (err) {
    res.status(500).json({ message: 'Error updating news' });
  }
});

// ❌ Delete news (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting news' });
  }
});

module.exports = router;
