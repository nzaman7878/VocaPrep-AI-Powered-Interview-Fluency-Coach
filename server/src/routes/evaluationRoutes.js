import express from 'express';
import { evaluateAnswer } from '../controllers/evaluationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All evaluation routes require authentication
router.use(protect);

router.post('/', evaluateAnswer);

export default router;
