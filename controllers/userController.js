
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { generate_token, hash_password, compare_password } = require('../services/authService');
const sendEmail = require('../services/emailService');

// Helper Function for OTP Generation
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return next({ status: 400, message: 'Validation error', data: errors.array() });

        const { email, name, phone, role, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return next({ status: 400, message: 'Email already registered' });

        const otp = generateOtp();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        const user = new User({ email, name, phone, role, otp, otpExpiry, password });
        await user.save();
        await sendEmail(email, 'OTP for Job Portal Registration', `Your OTP is ${otp}`);

        next({ status: 200, message: 'OTP sent to your email. Verify to complete registration.' });
    } catch (err) {
        next({ status: 500, message: 'Server error', data: err.message });
    }
};

const verify_registration_otp = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return next({ status: 400, message: 'Invalid or expired OTP' });
        }

        user.password = await hash_password(password);
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        next({ status: 200, message: 'Registration successful. You can now log in.' });
    } catch (err) {
        next({ status: 500, message: 'Server error', data: err.message });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.isVerified) return next({ status: 404, message: 'User not found or not verified' });

        const isMatch = await compare_password(password, user.password);
        if (!isMatch) return next({ status: 401, message: 'Invalid credentials' });

        const token = generate_token(user);
        next({ status: 200, message: 'Login successful', data: { token } });
    } catch (err) {
        next({ status: 500, message: 'Server error', data: err.message });
    }
};

// Forgot Password API
const forgot_password = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return next({ status: 404, message: 'User not found' });

        // Generate reset token and set expiry
        const resetToken = generateResetToken();
        const resetExpiry = Date.now() + 10 * 60 * 1000;  // 10 minutes expiry

        user.resetToken = resetToken;
        user.resetExpiry = resetExpiry;
        await user.save();

        // Send the reset token to the user's email
        await sendEmail(email, 'Password Reset OTP', `Your password reset OTP is ${resetToken}`);

        next({ status: 200, message: 'Password reset OTP sent to your email.' });
    } catch (err) {
        next({ status: 500, message: 'Server error', data: err.message });
    }
};

// Reset Password API
const reset_password = async (req, res, next) => {
    try {
        const { email, resetToken, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetToken !== resetToken || user.resetExpiry < Date.now()) {
            return next({ status: 400, message: 'Invalid or expired reset token' });
        }

        // Hash the new password and save it
        user.password = await hash_password(newPassword);
        user.resetToken = null;  // Clear the reset token
        user.resetExpiry = null;  // Clear the expiry
        await user.save();

        next({ status: 200, message: 'Password reset successful. You can now log in.' });
    } catch (err) {
        next({ status: 500, message: 'Server error', data: err.message });
    }
};

module.exports = { register, verify_registration_otp, login, forgot_password, reset_password };
