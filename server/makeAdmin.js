import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';

dotenv.config();

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.error('Please set ADMIN_EMAIL in your .env file');
      process.exit(1);
    }

    const user = await User.findOne({ email: adminEmail });
    if (!user) {
      console.error(`User with email ${adminEmail} not found. Please sign up first.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log(`Successfully made ${adminEmail} an admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeAdmin();
