const Recruiter = require("../../models/recruiter");
const { validationResult } = require("express-validator");
const otpCache = require("../../services/otpCache");
const { generate_OTP, send_OTP, verify_OTP } = require("../../utils/otp");
const { generate_token, hash_password, compare_password } = require("../../helpers/auth_helpers");

// Register Recruiter with OTP
const register_recruiter = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({ status: 400, message: "Validation error", data: errors.array() });
    }

    const { company_name, recruiter_name, email, password, contact_number } = req.body;

    try {
        const existing_recruiter = await Recruiter.findOne({ email });
        if (existing_recruiter) {
            return next({ status: 400, message: "Recruiter already registered" });
        }

        const otp = generate_OTP();
        send_OTP(email, otp);
        otpCache.setOTP(email, otp);

        const hashed_password = await hash_password(password);
        const new_recruiter = new Recruiter({
            company_name,
            recruiter_name,
            email,
            password: hashed_password,
            contact_number,
            is_verified: false
        });
        await new_recruiter.save();

        next({ status: 201, message: "Registration successful. OTP sent to email.", data: null });
    } catch (error) {
        next({ status: 500, message: "Server error", data: error.message });
    }
};

// Verify OTP
const verify_otp = async (req, res, next) => {
    const { email, otp } = req.body;
    const result = verify_OTP(email, otp);

    if (!result.success) {
        return next({ status: 400, message: result.message });
    }

    try {
        await Recruiter.findOneAndUpdate({ email }, { is_verified: true });
        next({ status: 200, message: "OTP verified. Account activated.", data: null });
    } catch (err) {
        next({ status: 500, message: "Server error", data: err.message });
    }
};

// Login Recruiter
const login_recruiter = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next({ status: 400, message: "Validation error", data: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter || !(await compare_password(password, recruiter.password))) {
            return next({ status: 400, message: "Invalid email or password" });
        }

        if (!recruiter.is_verified) {
            return next({ status: 400, message: "Account not verified. Please verify your email." });
        }

        const token = generate_token({ id: recruiter._id, role: "recruiter" });
        next({ status: 200, message: "Login successful", data: { token } });
    } catch (error) {
        next({ status: 500, message: "Server error", data: error.message });
    }
};

// Forgot Password
const forgot_password = async (req, res, next) => {
    const { email } = req.body;

    try {
        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter) {
            return next({ status: 404, message: "Recruiter not found" });
        }

        const otp = generate_OTP();
        send_OTP(email, otp);
        otpCache.setOTP(email, otp);

        next({ status: 200, message: "OTP sent for password reset", data: null });
    } catch (error) {
        next({ status: 500, message: "Server error", data: error.message });
    }
};

// Reset Password
const reset_password = async (req, res, next) => {
    const { email, otp, new_password } = req.body;

    const result = verify_OTP(email, otp);
    if (!result.success) {
        return next({ status: 400, message: result.message });
    }

    try {
        const hashed_password = await hash_password(new_password);
        await Recruiter.findOneAndUpdate({ email }, { password: hashed_password });

        next({ status: 200, message: "Password reset successfully", data: null });
    } catch (error) {
        next({ status: 500, message: "Server error", data: error.message });
    }
};

const logout_recruiter = async (req, res, next) => {
    try {
        // Invalidate token on the client-side (handled by frontend)
        req.user = null; // Clear recruiter data from the request

        return res.status(200).json({
            success: true,
            message: 'Logout successful.',
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Server error during logout',
            data: error.message,
        });
    }
};


module.exports = {
    register_recruiter,
    verify_otp,
    login_recruiter,
    logout_recruiter,
    forgot_password,
    reset_password
};
