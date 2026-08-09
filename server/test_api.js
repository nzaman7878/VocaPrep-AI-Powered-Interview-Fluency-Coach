import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YWJkZTFkMWZiMWZiMWZiMWZiMWZiMSIsImlhdCI6MTc4NjI3MzA4MSwiZXhwIjoxNzg2MjczOTgxfQ.tFNf1eLirKeDdx2GEuLKK_PTtbtShPpeugVWfyp4hBc';
  
  try {
    const res = await fetch('http://localhost:5000/api/transcription', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ }) // Missing audioUrl!
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
