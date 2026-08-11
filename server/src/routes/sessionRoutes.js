import express from 'express';
import {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  completeSession,
} from '../controllers/sessionController.js';
import questionRoutes from './questionRoutes.js';
import { protect } from '../middleware/auth.js';
import { enforceUsageLimit } from '../middleware/subscriptionCheck.js';

const router = express.Router();

// All session routes require authentication
router.use(protect);

// Mount question routes under a specific session
router.use('/:id/questions', questionRoutes);

router.route('/').post(enforceUsageLimit, createSession).get(getSessions);

router.route('/:id').get(getSessionById).put(updateSession);

router.post('/:id/complete', completeSession);

export default router;
