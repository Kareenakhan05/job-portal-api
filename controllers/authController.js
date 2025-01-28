import User from '../models/user.js';
import { generateToken, hashPassword, comparePassword } from '../services/authService.js';
import sendEmail from '../services/emailService.js';

// Register with OTP
export async function register(req, res) {
    try {
        const { email, name, phone, role, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required for registration' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        const user = new User({ email, name, phone, role, otp, otpExpiry, password });
        await user.save();

        // Send OTP to email
        await sendEmail(email, 'OTP for Job Portal Registration', `Your OTP is ${otp}`);
        res.status(200).json({ message: 'OTP sent to your email. Verify to complete registration.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Verify OTP for Registration
export async function verifyRegistrationOtp(req, res) {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the password and set user as verified
        user.password = await hashPassword(password);
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Registration successful. You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Login
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.isVerified) return res.status(404).json({ message: 'User not found or not verified' });

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Forgot Password
export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        await user.save();

        // Send OTP to email
        await sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}`);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Verify OTP for Password Reset
export async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Reset Password
export async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
