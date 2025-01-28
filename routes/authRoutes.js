import { Router } from 'express';
import {
    login,
    register,
    verify_registration_otp,
    forgot_password,
    verify_otp,
    reset_password
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Login Route
router.post('/login', login);

// Register Route with OTP
router.post('/register', register);

// Verify OTP for Registration
router.post('/verify-registration-otp', verify_registration_otp);

// Forgot Password
router.post('/forgot-password', forgot_password);

// Verify OTP for Password Reset
router.post('/verify-otp', verify_otp);

// Reset Password
router.post('/reset-password', reset_password);

export default router;
