import { Router } from 'express';
import { login, register, getProfile } from '../controllers';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register - Register new librarian
router.post('/register', register);

// POST /api/auth/login - Login
router.post('/login', login);

// GET /api/auth/profile - Get current user profile
router.get('/profile', authenticate, getProfile);

export default router;
