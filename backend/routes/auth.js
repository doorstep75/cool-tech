// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';

import User from '../models/User.js';
import { authenticateJWT } from '../middleware/auth.js'; // Correct import path

dotenv.config();
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required.')
      .isString()
      .trim(),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
      .isString()
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if user exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const result = await User.create({
        username,
        password: hashedPassword,
      });

      // Generate JWT
      const token = jwt.sign(
        { id: result._id, role: result.role },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      res.status(201).json({ result, token });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 * @access  Public
 */
router.post(
  '/login',
  [
    body('username')
      .notEmpty()
      .withMessage('Username is required.')
      .isString()
      .trim(),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
      .isString()
      .trim(),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Find user
      const existingUser = await User.findOne({ username });

      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: existingUser._id, role: existingUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      res.status(200).json({ result: existingUser, token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user's data
 * @access  Protected
 */
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password') // Exclude password from the response
      .populate('divisions'); // Populate divisions

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;