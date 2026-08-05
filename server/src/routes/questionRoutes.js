import express from 'express';
import { addQuestionAttempt } from '../controllers/questionController.js';
import { protect } from '../middleware/auth.js';

// use mergeParams: true so we can access :id from the parent session router
const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', addQuestionAttempt);

export default router;
