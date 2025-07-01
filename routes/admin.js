const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authenticate');

// 🛡 Middleware to restrict Super Admin-only actions
function requireSuperAdmin(req, res, next) {
  if (req.admin.role !== 'super') {
    return res.status(403).json({ message: 'Access denied. Super Admins only.' });
  }
  next();
}

// --------------------------
// 1. Admin Login Route
// --------------------------
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { id: admin._id, role: admin.role, fullname: admin.fullname },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      fullname: admin.fullname,
      role: admin.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------------
// 2. Get Current Admin Profile
// -------------------------------
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// -------------------------------
// 3. Update Admin Profile
// -------------------------------
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    const updateFields = {};

    if (fullname) updateFields.fullname = fullname;
    if (username) updateFields.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updated = await Admin.findByIdAndUpdate(
      req.admin.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated!', admin: updated });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

// -------------------------------
// 4. Super Admin Routes
// -------------------------------

// Get all admins (Super Admin only)
router.get('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Create new admin (Super Admin only)
router.post('/', authenticateToken, requireSuperAdmin, async (req, res) => {
  const { username, fullname, password, role } = req.body;
  try {
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(400).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, fullname, password: hashed, role: role || 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created!' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// Update any admin (Super Admin only)
router.put('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  const { fullname, username, password, role } = req.body;
  const update = {};

  if (fullname) update.fullname = fullname;
  if (username) update.username = username;
  if (role) update.role = role;
  if (password) update.password = await bcrypt.hash(password, 10);

  try {
    const updated = await Admin.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    res.json({ message: 'Admin updated', admin: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating admin' });
  }
});

// Delete admin (Super Admin only)
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
});

module.exports = router;
