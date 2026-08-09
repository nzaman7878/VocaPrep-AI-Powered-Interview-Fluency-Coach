import { transcribeAudio } from './src/services/transcriptionService.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  try {
    const res = await transcribeAudio('https://res.cloudinary.com/demo/video/upload/dog.mp3');
    console.log('Success:', res);
  } catch (err) {
    console.error('Error:', err);
  }
};
run();
