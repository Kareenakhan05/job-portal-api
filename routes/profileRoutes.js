import { Router } from 'express';
import { createProfile, getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/profile', authenticate, createProfile);
router.get('/profile/:email', authenticate, getProfile);
router.put('/profile/:email', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
