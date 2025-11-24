import { Router } from 'express';
import { login, register, getProfile, changePassword } from '../controllers';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register - Register new librarian
router.post('/register', register);

// POST /api/auth/login - Login
router.post('/login', login);

// GET /api/auth/profile - Get current user profile
router.get('/profile', authenticate, getProfile);

// POST /api/auth/change-password - Change current user password
router.post('/change-password', authenticate, changePassword);

export default router;
