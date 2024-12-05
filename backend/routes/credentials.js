// backend/routes/credentials.js

import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import Credential from '../models/Credential.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * Middleware to log incoming requests for debugging
 */
router.use((req, res, next) => {
  console.log(`Incoming request to: ${req.path}`);
  next();
});

/**
 * @route   GET /api/credentials/user
 * @desc    Fetch all credentials accessible to the authenticated user
 * @access  Protected (Authenticated users)
 */
router.get('/user', authenticateJWT, async (req, res) => {
  try {
    console.log(`Authenticated user divisions: ${req.user.divisions}`);
    const userDivisions = req.user.divisions; // Array of division IDs the user has access to

    // Fetch credentials that belong to the user's divisions
    const credentials = await Credential.find({
      division: { $in: userDivisions },
    }).populate('division', 'name'); // Populate division name

    console.log(`Fetched credentials: ${JSON.stringify(credentials, null, 2)}`);
    res.json({ result: credentials });
  } catch (error) {
    console.error('Error fetching credentials for user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   GET /api/credentials
 * @desc    Fetch all credentials (Admin Only)
 * @access  Protected (Admin users)
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    console.log(`Admin check for user role: ${req.user.role}`);
    // Only admins can fetch all credentials
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admins only.',
      });
    }

    const credentials = await Credential.find().populate('division', 'name');
    console.log(`Fetched all credentials (admin): ${JSON.stringify(credentials, null, 2)}`);
    res.json({ result: credentials });
  } catch (error) {
    console.error('Error fetching all credentials:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   POST /api/credentials
 * @desc    Add a new credential
 * @access  Protected (Authenticated users)
 */
router.post(
  '/',
  authenticateJWT,
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
    body('description').optional().isString().trim(),
    body('division')
      .notEmpty()
      .withMessage('Division is required.')
      .isMongoId()
      .withMessage('Invalid division ID.'),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, description, division } = req.body;

    try {
      console.log(`Adding credential with division: ${division}`);

      // Allow admins to add credentials to any division
      if (req.user.role !== 'admin' && !req.user.divisions.includes(division)) {
        return res.status(403).json({
          message: 'You do not have permission to add credentials to this division.',
        });
      }

      // Check if a credential with the same username already exists in the division
      const existingCredential = await Credential.findOne({
        username,
        division,
      });

      if (existingCredential) {
        return res.status(400).json({
          message: 'A credential with this username already exists in the selected division.',
        });
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new credential
      const newCredential = await Credential.create({
        username,
        password: hashedPassword,
        description,
        division,
      });

      console.log(`New credential created: ${JSON.stringify(newCredential, null, 2)}`);
      res.status(201).json({ result: newCredential });
    } catch (error) {
      console.error('Error adding credential:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * @route   GET /api/credentials/:id
 * @desc    Fetch a single credential by ID
 * @access  Protected (Authenticated users with access)
 */
router.get('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const credential = await Credential.findById(id).populate('division', 'name');

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found.' });
    }

    // Check if the credential's division is among the user's divisions or if the user is an admin
    if (
      !req.user.divisions.includes(credential.division._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission to view this credential.',
      });
    }

    console.log(`Fetched credential: ${JSON.stringify(credential, null, 2)}`);
    res.json({ result: credential });
  } catch (error) {
    console.error('Error fetching credential:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route   PUT /api/credentials/:id
 * @desc    Update a credential by ID
 * @access  Protected (Admins and users with access)
 */
router.put(
  '/:id',
  authenticateJWT,
  [
    body('username').optional().isString().trim().notEmpty().withMessage('Username cannot be empty.'),
    body('password')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
    body('description').optional().isString().trim(),
    body('division').optional().isMongoId().withMessage('Invalid division ID.'),
  ],
  async (req, res) => {
    const { id } = req.params;

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, description, division } = req.body;

    try {
      const credential = await Credential.findById(id);

      if (!credential) {
        return res.status(404).json({ message: 'Credential not found.' });
      }

      // Check if the user has permission to update this credential
      if (
        !req.user.divisions.includes(credential.division.toString()) &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          message: 'Access denied. You do not have permission to update this credential.',
        });
      }

      // If division is being updated, ensure the user has access to the new division
      if (division) {
        if (!req.user.divisions.includes(division)) {
          return res.status(403).json({
            message: 'You do not have permission to assign this credential to the selected division.',
          });
        }
        credential.division = division;
      }

      // Update fields if provided
      if (username) credential.username = username;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        credential.password = hashedPassword;
      }
      if (description) credential.description = description;

      await credential.save();
      console.log(`Updated credential: ${JSON.stringify(credential, null, 2)}`);
      res.json({ result: credential });
    } catch (error) {
      console.error('Error updating credential:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * @route   DELETE /api/credentials/:id
 * @desc    Delete a credential by ID
 * @access  Protected (Admins and users with access)
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const credential = await Credential.findById(id);

    if (!credential) {
      return res.status(404).json({ message: 'Credential not found.' });
    }

    // Check if the user has permission to delete this credential
    if (
      !req.user.divisions.includes(credential.division.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission to delete this credential.',
      });
    }

    await Credential.findByIdAndDelete(id);
    console.log(`Deleted credential with ID: ${id}`);
    res.json({ message: 'Credential deleted successfully.' });
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;