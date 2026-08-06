import express from 'express';
import multer from 'multer';
import { uploadAudio } from '../controllers/audioController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer to hold the file in memory as a Buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Protect all audio routes
router.use(protect);

// Endpoint expects multipart/form-data with a field named 'audio'
router.post('/upload', upload.single('audio'), uploadAudio);

export default router;
