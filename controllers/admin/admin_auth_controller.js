const Admin = require('../../models/admin.js');
const Recruiter = require('../../models/recruiter.js'); 
const { generate_token, hash_password, compare_password } = require('../../helpers/auth_helpers.js');
const { send_response } = require('../../helpers/response_helpers.js');
const { sendOtp, verifyOtp } = require('../../services/otp_services.js');
const { validationResult } = require('express-validator');

// 🚀 Register Admin with OTP Verification
const register_admin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return send_response(res, 400, 'Validation error', errors.array());
        }

        const { email, password, name, phone, role, otp } = req.body;

        const existing_admin = await Admin.findOne({ email });
        if (existing_admin) {
            return send_response(res, 400, 'Admin already registered');
        }

        // Verify OTP
        if (!verifyOtp(email, otp)) {
            return send_response(res, 400, 'Invalid or expired OTP');
        }

        const hashed_password = await hash_password(password);
        const new_admin = new Admin({ email, password: hashed_password, name, phone, role });
        await new_admin.save();

        send_response(res, 201, 'Admin registered successfully');
    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

// 🚀 Universal Login (Admin & Recruiter)
const login_user = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return send_response(res, 400, 'Validation error', errors.array());
        }

        const { email, password } = req.body;

        // Check if user exists in Admin collection
        let user = await Admin.findOne({ email });
        let user_type = 'admin';

        if (!user) {
            // If not found in Admin, check in Recruiter collection
            user = await Recruiter.findOne({ email });
            user_type = 'recruiter';
        }

        if (!user) {
            return send_response(res, 404, 'User not found');
        }

        // Verify password
        if (!(await compare_password(password, user.password))) {
            return send_response(res, 401, 'Invalid credentials');
        }

        // Generate JWT token
        const token = generate_token(user._id);

        // Send response with user type
        send_response(res, 200, 'Login successful', {
            token,
            user_id: user._id,
            name: user.name,
            email: user.email,
            user_type
        });

    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

// 🚀 Forgot Password - Send OTP
const forgot_password = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return send_response(res, 400, 'Validation error', errors.array());
        }

        const { email } = req.body;

        let user = await Admin.findOne({ email }) || await Recruiter.findOne({ email });

        if (!user) {
            return send_response(res, 404, 'User not found');
        }

        sendOtp(email);

        send_response(res, 200, 'OTP sent to email for password reset');
    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

// 🚀 Reset Password with OTP
const reset_password = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return send_response(res, 400, 'Validation error', errors.array());
        }

        const { email, otp, new_password } = req.body;

        if (!verifyOtp(email, otp)) {
            return send_response(res, 400, 'Invalid or expired OTP');
        }

        const hashed_password = await hash_password(new_password);
        let user = await Admin.findOne({ email }) || await Recruiter.findOne({ email });

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

// 🚀 Admin Logout (Client-Side Token Removal)
const logout_user = async (req, res) => {
    try {
        // Since JWTs are stateless, we just instruct the client to remove the token
        send_response(res, 200, 'Logout successful');
    } catch (err) {
        send_response(res, 500, 'Server error', err.message);
    }
};

// ✅ Export the controller functions
module.exports = {
    register_admin,
    login_user,
    forgot_password,
    reset_password,
    logout_user
};
