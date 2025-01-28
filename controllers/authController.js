import { check, validationResult } from 'express-validator';
import User from '../models/user.js';
import {  generate_token, hash_password, compare_password } from '../services/authService.js';
import sendEmail from '../services/emailService.js';

// Helper Function for Standardized Responses
const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        message,
        data
    });
};

// Helper Function for OTP Generation
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register with OTP
export async function register(req, res) {
    try {
        const { email, name, phone, role, password } = req.body;

        // Validate incoming data
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return sendResponse(res, 400, 'Validation error', validationErrors.array());
        }

        if (!password) {
            return sendResponse(res, 400, 'Password is required for registration');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return sendResponse(res, 400, 'Email already registered');

        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        const user = new User({ email, name, phone, role, otp, otpExpiry, password });
        await user.save();

        // Send OTP to email
        await sendEmail(email, 'OTP for Job Portal Registration', `Your OTP is ${otp}`);
        sendResponse(res, 200, 'OTP sent to your email. Verify to complete registration.');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Verify OTP for Registration
export async function verify_registration_otp(req, res) {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return sendResponse(res, 400, 'Invalid or expired OTP');
        }

        // Hash the password and set user as verified
        user.password = await hashPassword(password);
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        sendResponse(res, 200, 'Registration successful. You can now log in.');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Login
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isVerified) return sendResponse(res, 404, 'User not found or not verified');

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return sendResponse(res, 401, 'Invalid credentials');

        const token = generateToken(user);
        sendResponse(res, 200, 'Login successful', { token });
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Forgot Password
export async function forgot_password(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return sendResponse(res, 404, 'User not found');

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        await user.save();

        // Send OTP to email
        await sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}`);
        sendResponse(res, 200, 'OTP sent to email');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Verify OTP for Password Reset
export async function verify_otp(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return sendResponse(res, 400, 'Invalid or expired OTP');
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        sendResponse(res, 200, 'OTP verified successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Reset Password
export async function reset_password(req, res) {
    try {
        const { email, new_password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return sendResponse(res, 404, 'User not found');

        const hashedPassword = await hashPassword(new_password);
        user.password = hashedPassword;
        await user.save();

        sendResponse(res, 200, 'Password reset successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Validation Middleware (using express-validator)
export const validateRegisterUser = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('role').notEmpty().withMessage('Role is required'),
    check('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
];

export const validateLogin = [
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
];

export const validateForgotPassword = [
    check('email').isEmail().withMessage('Invalid email format')
];

export const validateResetPassword = [
    check('email').isEmail().withMessage('Invalid email format'),
    check('new_password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
];
