// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Unauthorized access.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database and populate divisions
    const user = await User.findById(decoded.id).populate('divisions');

    if (!user) {
      return res.status(404).json({ message: 'User not found. Invalid token.' });
    }

    // Prevent inactive or deleted users from accessing
    if (user.status === 'inactive' || user.deleted) {
      return res.status(403).json({ message: 'Account is inactive or deleted. Access denied.' });
    }

    // Attach user information to the request object
    req.user = {
      id: user._id.toString(),
      role: user.role,
      divisions: user.divisions.map((division) => division._id.toString()),
    };
    console.log('Authenticated User:', req.user); // Add this line
    next();
  } catch (err) {
    console.error('Authentication error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Unauthorized access.' });
    }

    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};