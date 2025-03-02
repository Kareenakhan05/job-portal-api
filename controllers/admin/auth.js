const User = require('../../models/user.js');
const Recruiter = require('../../models/recruiter.js');
const Admin = require('../../models/admin.js');

const { generate_token, hash_password, compare_password } = require('../../helpers/auth_helpers.js');
const { send_response } = require('../../helpers/response_helpers.js');
const { sendOtp, verifyOtp } = require('../../services/otp.js');

/**
 * 🚀 User (Job Seeker) Registration
 */
const register_user = async (req, res) => {
    try {
        const { email, password, name, phone, otp } = req.body;

        const existing_user = await User.findOne({ email });
        if (existing_user) {
            return send_response(res, 400, 'User already registered');
        }

        if (!verifyOtp(email, otp)) {
            return send_response(res, 400, 'Invalid or expired OTP');
        }

        const hashed_password = await hash_password(password);
        const new_user = new User({ email, password: hashed_password, name, phone });
        await new_user.save();

        send_response(res, 201, 'User registered successfully');
    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

/**
 * 🚀 Universal Login (Admin & Recruiter)
 */
const login_admin_recruiter = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await Admin.findOne({ email });
        let role = 'admin';

        if (!user) {
            user = await Recruiter.findOne({ email });
            role = 'recruiter';
        }

        if (!user) {
            return send_response(res, 404, 'User not found');
        }

        if (!(await compare_password(password, user.password))) {
            return send_response(res, 401, 'Invalid credentials');
        }

        const token = generate_token(user._id, role);
        send_response(res, 200, 'Login successful', { token, role, user_id: user._id, name: user.name, email: user.email });

    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

/**
 * 🚀 User (Job Seeker) Login
 */
const login_user = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return send_response(res, 404, 'User not found');
        }

        if (!(await compare_password(password, user.password))) {
            return send_response(res, 401, 'Invalid credentials');
        }

        const token = generate_token(user._id, 'user');
        send_response(res, 200, 'Login successful', { token, user_id: user._id, name: user.name, email: user.email });
    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

/**
 * 🚀 Forgot Password - Send OTP
 */
const forgot_password = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email }) || await Recruiter.findOne({ email }) || await Admin.findOne({ email });

        if (!user) {
            return send_response(res, 404, 'User not found');
        }

        sendOtp(email);
        send_response(res, 200, 'OTP sent to email for password reset');
    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

/**
 * 🚀 Reset Password with OTP
 */
const reset_password = async (req, res) => {
    try {
        const { email, otp, new_password } = req.body;

        if (!verifyOtp(email, otp)) {
            return send_response(res, 400, 'Invalid or expired OTP');
        }

        const hashed_password = await hash_password(new_password);
        let user = await User.findOne({ email }) || await Recruiter.findOne({ email }) || await Admin.findOne({ email });

        if (!user) {
            return send_response(res, 404, 'User not found');
        }

        user.password = hashed_password;
        await user.save();
        send_response(res, 200, 'Password reset successfully');
    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

module.exports = {
    register_user,
    login_admin_recruiter,
    login_user,
    forgot_password,
    reset_password
};
