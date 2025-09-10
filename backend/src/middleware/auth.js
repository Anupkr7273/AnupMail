// src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // { id, email }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
