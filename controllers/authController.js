const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'tde-secret'; // put in .env later

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ msg: 'Username already exists' });

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    res.status(201).json({ msg: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
