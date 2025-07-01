const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'tde-secret';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Expect: Bearer <token>
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = authMiddleware;
