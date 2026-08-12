import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from './src/models/User.js';

dotenv.config();

const generateAdminTokenAndTest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminEmail = process.env.ADMIN_EMAIL;
    let user = await User.findOne({ email: adminEmail });
    
    if (!user) {
      console.log('Admin user not found, creating one...');
      user = new User({
        name: 'Admin User',
        email: adminEmail,
        role: 'admin',
        googleId: 'test_admin_google_id_123'
      });
      await user.save();
    }
    
    // Make sure they are admin
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token for admin:', token);

    // Now test the routes using fetch
    console.log('\n--- GET /api/admin/stats ---');
    const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const statsData = await statsRes.json();
    console.log(JSON.stringify(statsData, null, 2));

    console.log('\n--- GET /api/admin/users ---');
    const usersRes = await fetch('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usersData = await usersRes.json();
    console.log(JSON.stringify(usersData, null, 2));

    console.log('\n--- GET /api/admin/subscriptions ---');
    const subRes = await fetch('http://localhost:5000/api/admin/subscriptions', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const subData = await subRes.json();
    console.log(JSON.stringify(subData, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generateAdminTokenAndTest();
