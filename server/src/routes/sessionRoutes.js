import express from 'express';
import { createSession, getSessions, getSessionById } from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All session routes require authentication
router.use(protect);

router.route('/').post(createSession).get(getSessions);

router.route('/:id').get(getSessionById);

export default router;
