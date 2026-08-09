import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Session from './src/models/Session.js';
dotenv.config();

const token = jwt.sign({ id: '6a76d47ece5dd43e1f411c67' }, process.env.JWT_SECRET, { expiresIn: '15m' });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    let session = await Session.findOne();
    if (!session) {
      process.exit(0);
    }
    const sessionId = session._id.toString();

    session.questions.push({
      questionText: 'What is a debounce function?',
      questionType: 'technical',
      transcript: 'A debounce function limits the rate at which a function can fire.',
    });
    await session.save();
    const attemptId = session.questions[session.questions.length - 1]._id.toString();

    console.log('Evaluating with wordTimestamps...');
    const evalRes = await fetch('http://localhost:5000/api/evaluate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        attemptId,
        transcript: 'A debounce function limits the rate at which a function can fire.',
        wordTimestamps: [
          { text: "A", start: 0, end: 0.5 },
          { text: "debounce", start: 0.5, end: 1.0 },
          { text: "function", start: 1.0, end: 1.5 },
          { text: "um", start: 1.5, end: 2.0 },
          { text: "limits", start: 2.5, end: 3.0 }
        ]
      })
    });
    
    if (!evalRes.ok) {
        const txt = await evalRes.text();
        console.error('Evaluate HTTP Error:', evalRes.status, txt);
    } else {
        const json = await evalRes.json();
        console.log('Evaluate Success:', JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.error('Fetch Error:', err);
  } finally {
    process.exit(0);
  }
};
run();
