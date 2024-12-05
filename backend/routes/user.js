import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import Credential from '../models/Credential.js';
import Division from '../models/Division.js';
import OrganisationalUnit from '../models/OrganisationalUnit.js';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to validate ObjectId format
const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return `${fieldName} is not a valid ObjectId`;
  }
  return null;
};

// View Credentials for a Division
router.get('/divisions/:id/credentials', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  const idError = validateObjectId(id, 'Division ID');
  if (idError) {
    return res.status(400).json({ message: idError });
  }

  try {
    const division = await Division.findById(id).populate('credentialRepository');

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    // Check if user has access
    if (!req.user.divisions.includes(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(division.credentialRepository);
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Add Credential to a Division
router.post('/divisions/:id/credentials', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { username, password, description } = req.body;

  // Validate ObjectId format
  const idError = validateObjectId(id, 'Division ID');
  if (idError) {
    return res.status(400).json({ message: idError });
  }

  // Validate input fields
  const validationErrors = [
    username && typeof username !== 'string' && 'Username must be a string',
    password && typeof password !== 'string' && 'Password must be a string',
    description && typeof description !== 'string' && 'Description must be a string',
  ].filter((error) => error);

  if (validationErrors.length > 0) {
    return res.status(400).json({ message: validationErrors.join(', ') });
  }

  try {
    const division = await Division.findById(id);

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    // Check if user has access
    if (!req.user.divisions.includes(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const credential = new Credential({ username, password, description });
    await credential.save();

    division.credentialRepository.push(credential._id);
    await division.save();

    res.status(201).json({ message: 'Credential added successfully' });
  } catch (error) {
    console.error('Error adding credential:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update Credential
router.put('/credentials/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { username, password, description } = req.body;

  // Validate ObjectId format
  const idError = validateObjectId(id, 'Credential ID');
  if (idError) {
    return res.status(400).json({ message: idError });
  }

  // Validate optional fields
  const fieldErrors = [
    username && typeof username !== 'string' && 'Username must be a string',
    password && typeof password !== 'string' && 'Password must be a string',
    description && typeof description !== 'string' && 'Description must be a string',
  ].filter((error) => error);

  if (fieldErrors.length > 0) {
    return res.status(400).json({ message: fieldErrors.join(', ') });
  }

  try {
    const credential = await Credential.findById(id);

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found' });
    }

    // Role-based access control
    if (req.user.role === 'normal') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.user.role === 'management' && !req.user.divisions.includes(credential.division.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    credential.username = username || credential.username;
    credential.password = password || credential.password;
    credential.description = description || credential.description;

    await credential.save();
    res.status(200).json({ message: 'Credential updated successfully' });
  } catch (error) {
    console.error('Error updating credential:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get divisions for the logged-in user
router.get('/divisions', authenticateJWT, async (req, res) => {
  try {
    const user = req.user;

    // Fetch divisions assigned to the user
    const divisions = await Division.find({ _id: { $in: user.divisions } });

    res.status(200).json(divisions);
  } catch (error) {
    console.error('Error fetching divisions:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get organisational units for the logged-in user
router.get('/ous', authenticateJWT, async (req, res) => {
  try {
    const user = req.user;

    // Fetch divisions assigned to the user
    const divisions = await Division.find({ _id: { $in: user.divisions } });

    // Get unique OUs based on the user's divisions
    const ouIds = [...new Set(divisions.map((division) => division.ou))];
    const ous = await OrganisationalUnit.find({ _id: { $in: ouIds } });

    res.status(200).json(ous);
  } catch (error) {
    console.error('Error fetching organisational units:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;