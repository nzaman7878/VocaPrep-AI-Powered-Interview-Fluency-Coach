import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
};
run();
