import express from 'express';
import { getProgressSnapshots, getProgressSummary } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All progress routes require authentication
router.use(protect);

router.get('/', getProgressSnapshots);
router.get('/summary', getProgressSummary);

export default router;
