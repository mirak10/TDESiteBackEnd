const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Access: req.admin.id, req.admin.fullname, req.admin.role
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateToken;
