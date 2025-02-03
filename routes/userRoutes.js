const express = require('express');
const router = express.Router();
const { register, verify_registration_otp, login, forgot_password, reset_password } = require('../controllers/userController');
const { validateRegistration, validateOtpVerification, validateLogin, validateForgotPassword, validateResetPassword } = require('../validators/user_validator');
const { validateRequest } = require('../middlewares/responseMiddleware');

// User Registration Route
router.post('/register', validateRegistration, validateRequest, register);

// OTP Verification Route
router.post('/verify-otp', validateOtpVerification, validateRequest, verify_registration_otp);

// Login Route
router.post('/login', validateLogin, validateRequest, login);

// Forgot Password Route
router.post('/forgot-password', validateForgotPassword, validateRequest, forgot_password);

// Reset Password Route
router.post('/reset-password', validateResetPassword, validateRequest, reset_password);

module.exports = router;
