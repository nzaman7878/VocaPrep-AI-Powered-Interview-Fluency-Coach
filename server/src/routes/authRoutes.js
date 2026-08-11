import express from 'express';
import { body } from 'express-validator';
import { googleAuth, refreshToken } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const googleAuthValidation = [
  body('credential').notEmpty().withMessage('Google credential token is required'),
];

router.post('/google', googleAuthValidation, validate, googleAuth);
router.post('/refresh', refreshToken);

export default router;
