import express from 'express';
import {
  getStats,
  getUsers,
  updateUserRole,
  getSubscriptions,
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply protect and isAdmin middleware to all routes in this file
router.use(protect, isAdmin);

// GET /api/admin/stats
router.get('/stats', getStats);

// GET /api/admin/users
router.get('/users', getUsers);

// PUT /api/admin/users/:id
router.put('/users/:id', updateUserRole);

// GET /api/admin/subscriptions
router.get('/subscriptions', getSubscriptions);

export default router;
