import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import Credential from '../models/Credential.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

/**
 * Log incoming requests for debugging
 */
router.use((req, res, next) => {
  console.log(`Incoming request to: ${req.path}`);
  next();
});

/**
 * Fetch credentials accessible to the authenticated user
 * @route GET /api/credentials/user
 * @access Protected
 */
router.get('/user', authenticateJWT, async (req, res) => {
  try {
    const userDivisions = req.user.divisions;
    const credentials = await Credential.find({
      division: { $in: userDivisions },
    }).populate('division', 'name');
    res.json({ result: credentials });
  } catch (error) {
    console.error('Error fetching user credentials:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Fetch all credentials (Admin only)
 * @route GET /api/credentials
 * @access Protected
 */
router.get('/', authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const credentials = await Credential.find().populate('division', 'name');
    res.json({ result: credentials });
  } catch (error) {
    console.error('Error fetching all credentials:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Add a new credential
 * @route POST /api/credentials
 * @access Protected
 */
router.post(
  '/',
  authenticateJWT,
  [
    body('username').notEmpty().withMessage('Username is required.').trim(),
    body('password')
      .notEmpty()
      .withMessage('Password is required.')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long.'),
    body('description').optional().trim(),
    body('division').notEmpty().withMessage('Division is required.').isMongoId(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, description, division } = req.body;

    try {
      if (req.user.role !== 'admin' && !req.user.divisions.includes(division)) {
        return res.status(403).json({
          message: 'You do not have permission to add credentials to this division.',
        });
      }

      const existingCredential = await Credential.findOne({ username, division });
      if (existingCredential) {
        return res.status(400).json({
          message: 'A credential with this username already exists in the division.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newCredential = await Credential.create({
        username,
        password: hashedPassword,
        description,
        division,
      });

      res.status(201).json({ result: newCredential });
    } catch (error) {
      console.error('Error adding credential:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * Fetch a credential by ID
 * @route GET /api/credentials/:id
 * @access Protected
 */
router.get('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const credential = await Credential.findById(id).populate('division', 'name');
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found.' });
    }

    if (
      !req.user.divisions.includes(credential.division._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission to view this credential.',
      });
    }

    res.json({ result: credential });
  } catch (error) {
    console.error('Error fetching credential:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Update a credential by ID
 * @route PUT /api/credentials/:id
 * @access Protected
 */
router.put(
  '/:id',
  authenticateJWT,
  [
    body('username').optional().trim().notEmpty(),
    body('password').optional().isLength({ min: 6 }),
    body('description').optional().trim(),
    body('division').optional().isMongoId(),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { username, password, description, division } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const credential = await Credential.findById(id);
      if (!credential) {
        return res.status(404).json({ message: 'Credential not found.' });
      }

      if (
        !req.user.divisions.includes(credential.division.toString()) &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          message: 'Access denied. You do not have permission to update this credential.',
        });
      }

      if (division && !req.user.divisions.includes(division)) {
        return res.status(403).json({
          message: 'You do not have permission to assign this credential to the division.',
        });
      }

      if (username) credential.username = username;
      if (password) credential.password = await bcrypt.hash(password, 12);
      if (description) credential.description = description;
      if (division) credential.division = division;

      await credential.save();
      res.json({ result: credential });
    } catch (error) {
      console.error('Error updating credential:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

/**
 * Delete a credential by ID
 * @route DELETE /api/credentials/:id
 * @access Protected
 */
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const credential = await Credential.findById(id);
    if (!credential) {
      return res.status(404).json({ message: 'Credential not found.' });
    }

    if (
      !req.user.divisions.includes(credential.division.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Access denied. You do not have permission to delete this credential.',
      });
    }

    await Credential.findByIdAndDelete(id);
    res.json({ message: 'Credential deleted successfully.' });
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;