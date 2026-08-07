import express from 'express';
import { generateQuestion } from '../controllers/questionGenController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateQuestion);

export default router;
