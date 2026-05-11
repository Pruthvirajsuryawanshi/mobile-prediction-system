import express from 'express';
import { register, login, getProfile, toggleFavorite } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/favorites/:mobileId', authMiddleware, toggleFavorite);

export default router;
