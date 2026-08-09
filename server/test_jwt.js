import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const token = jwt.sign({ id: '66abde1d1fb1fb1fb1fb1fb1' }, process.env.JWT_SECRET, { expiresIn: '15m' });
console.log('Token:', token);
