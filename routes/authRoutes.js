import { Router } from 'express';
import {
    login,
    register,
    verifyRegistrationOtp,
    forgotPassword,
    verifyOtp,
    resetPassword
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Login Route
router.post('/login', login);

// Register Route with OTP
router.post('/register', register);

// Verify OTP for Registration
router.post('/verify-registration-otp', verifyRegistrationOtp);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Verify OTP for Password Reset
router.post('/verify-otp', verifyOtp);

// Reset Password
router.post('/reset-password', resetPassword);

export default router;
