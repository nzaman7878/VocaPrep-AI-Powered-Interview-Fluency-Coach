import express from 'express';
import { transcribe } from '../controllers/transcriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all transcription routes
router.use(protect);

router.post('/', transcribe);

export default router;
