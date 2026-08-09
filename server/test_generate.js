import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const token = jwt.sign({ id: '6a76d47ece5dd43e1f411c67' }, process.env.JWT_SECRET, { expiresIn: '15m' });

const run = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/questions/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: '6a76d4b7ce5dd43e1f411c68',
        role: 'Frontend Developer',
        questionType: 'technical'
      })
    });
    
    if (!res.ok) {
        const txt = await res.text();
        console.error('HTTP Error:', res.status, txt);
    } else {
        const json = await res.json();
        console.log('Success:', json);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
  }
};
run();
