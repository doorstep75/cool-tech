// backend/routes/admin.js

import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import User from '../models/User.js';
import Division from '../models/Division.js'; // Import Division model
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Helper function to validate ObjectId format
const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return `${fieldName} is not a valid ObjectId`;
  }
  return null;
};

// **New Route**: Get All Users (Admin Only)
router.get('/users', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const users = await User.find().populate('divisions', 'name');
    res.json({ result: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/admin/divisions
 * @desc    Fetch all divisions
 * @access  Protected (Admin users only)
 */
router.get('/divisions', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const divisions = await Division.find(); // Fetch all divisions
    res.json({ divisions });
  } catch (error) {
    console.error('Error fetching divisions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Fetch a user by ID (Admin Only)
 * @access  Protected (Admin users)
 */
router.get('/users/:id', authenticateJWT, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('divisions', 'name');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Assign User to Division or OU
router.post('/assign', authenticateJWT, isAdmin, async (req, res) => {
  const { userId, divisionId, ouId } = req.body;

  // Validate input fields
  const validationErrors = [
    validateObjectId(userId, 'userId'),
    divisionId && validateObjectId(divisionId, 'divisionId'),
    ouId && validateObjectId(ouId, 'ouId'),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return res.status(400).json({ message: validationErrors.join(', ') });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (divisionId) {
      // Check if the division is already assigned
      if (user.divisions.includes(divisionId)) {
        return res
          .status(400)
          .json({ message: 'User is already assigned to the specified division' });
      }
      user.divisions.push(divisionId);
    }

    if (ouId) {
      // Check if the OU is already assigned
      if (user.ous.includes(ouId)) {
        return res
          .status(400)
          .json({ message: 'User is already assigned to the specified organisational unit' });
      }
      user.ous.push(ouId);
    }

    await user.save();

    res.status(200).json({ message: 'User assigned successfully' });
  } catch (error) {
    console.error('Error assigning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Unassign User from Division or OU
router.post('/unassign', authenticateJWT, isAdmin, async (req, res) => {
  const { userId, divisionId, ouId } = req.body;

  // Validate input fields
  const validationErrors = [
    validateObjectId(userId, 'userId'),
    divisionId && validateObjectId(divisionId, 'divisionId'),
    ouId && validateObjectId(ouId, 'ouId'),
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return res.status(400).json({ message: validationErrors.join(', ') });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (divisionId) {
      // Check if the division is not assigned
      if (!user.divisions.includes(divisionId)) {
        return res
          .status(400)
          .json({ message: 'User is not assigned to the specified division' });
      }
      user.divisions = user.divisions.filter((id) => id.toString() !== divisionId);
    }

    if (ouId) {
      // Check if the OU is not assigned
      if (!user.ous.includes(ouId)) {
        return res
          .status(400)
          .json({ message: 'User is not assigned to the specified organisational unit' });
      }
      user.ous = user.ous.filter((id) => id.toString() !== ouId);
    }

    await user.save();

    res.status(200).json({ message: 'User unassigned successfully' });
  } catch (error) {
    console.error('Error unassigning user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change User Role
router.post('/change-role', authenticateJWT, isAdmin, async (req, res) => {
  const { userId, role } = req.body;

  // Validate input fields
  const validationErrors = [
    validateObjectId(userId, 'userId'),
    !['normal', 'management', 'admin'].includes(role) && 'Invalid role provided',
  ].filter(Boolean);

  if (validationErrors.length > 0) {
    return res.status(400).json({ message: validationErrors.join(', ') });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;