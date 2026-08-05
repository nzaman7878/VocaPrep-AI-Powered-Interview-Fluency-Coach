import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation for update profile
const updateValidation = [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('targetRole').optional().isString().withMessage('Target role must be a string'),
  body('weakAreas').optional().isArray().withMessage('Weak areas must be an array of strings'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

router
  .route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateValidation, validate, updateUserProfile);

export default router;
