const { validationResult } = require('express-validator');
const User = require('../../models/user');
const { generate_token, hash_password, compare_password } = require('../../services/authService');
const { generate_OTP, send_OTP, verify_OTP } = require('../../utils/otp');

// Register User
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.sendResponse(400, 'Validation error', errors.array());
    }

    const { email, name, phone, role, password } = req.body;

    try {
        const existing_user = await User.findOne({ email });
        if (existing_user) {
            return res.sendResponse(400, 'Email already registered');
        }

        const otp = generate_OTP();
        await send_OTP(email, otp); // Send OTP via email
        otpCache.storeOTP(email, otp); // Store OTP in memory (cache)

        const hashed_password = await hash_password(password);

        const user = new User({
            email,
            name,
            phone,
            role,
            password: hashed_password,
            is_verified: false
        });

        await user.save();
        res.sendResponse(200, 'OTP sent to your email. Verify to complete registration.');
    } catch (err) {
        res.sendResponse(500, 'Server error', err.message);
    }
};

// Verify Registration OTP
const verify_registration_otp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const verification_result = verify_OTP(email, otp);

        if (!verification_result.success) {
            return res.sendResponse(400, verification_result.message);
        }

        await User.updateOne({ email }, { is_verified: true });
        res.sendResponse(200, 'Registration successful. You can now log in.');
    } catch (err) {
        res.sendResponse(500, 'Server error', err.message);
    }
};

// User Login
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.sendResponse(400, 'Validation error', errors.array());
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.is_verified) {
            return res.sendResponse(404, 'User not found or not verified');
        }

        const is_match = await compare_password(password, user.password);
        if (!is_match) {
            return res.sendResponse(401, 'Invalid credentials');
        }

        const token = generate_token(user);
        res.sendResponse(200, 'Login successful', { token });
    } catch (err) {
        res.sendResponse(500, 'Server error', err.message);
    }
};

// Forgot Password
const forgot_password = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.sendResponse(404, 'User not found');
        }

        const reset_otp = generate_OTP();
        otpCache.storeOTP(email, reset_otp);  // Store reset OTP in cache
        await send_OTP(email, reset_otp);     // Send OTP via email

        res.sendResponse(200, 'Password reset OTP sent to your email.');
    } catch (err) {
        res.sendResponse(500, 'Server error', err.message);
    }
};

// Reset Password
const reset_password = async (req, res) => {
    const { email, otp, new_password } = req.body;

    try {
        const verification_result = verify_OTP(email, otp);
        if (!verification_result.success) {
            return res.sendResponse(400, verification_result.message);
        }

        const hashed_password = await hash_password(new_password);
        await User.updateOne({ email }, { password: hashed_password });

        res.sendResponse(200, 'Password reset successful. You can now log in.');
    } catch (err) {
        res.sendResponse(500, 'Server error', err.message);
    }
};

module.exports = {
    register,
    verify_registration_otp,
    login,
    forgot_password,
    reset_password
};
