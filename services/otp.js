const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const otp_cache = new Map(); // ✅ In-memory storage for OTPs

// **Generate Token**
const generate_token = (user_id) => {
    try {
        const token = jwt.sign({ user_id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRY_TIME });
        return token;
    } catch (err) {
        console.error("❌ Error generating token:", err);
        return null;
    }
};

// **Generate OTP**
const generate_otp = (email) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // ✅ Generate 6-digit OTP
        otp_cache.set(email, otp); // ✅ Store OTP in memory
        console.log(`📩 OTP for ${email}: ${otp}`); // ✅ Simulate sending OTP
        return otp;
    } catch (err) {
        console.error("❌ Error generating OTP:", err);
        return null;
    }
};

// **Verify OTP with JWT Token**
const verify_otp = (token, email, otp) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const stored_otp = otp_cache.get(email);

        if (!stored_otp) {
            return { success: false, message: "OTP expired or not found" };
        }

        if (stored_otp !== otp) {
            return { success: false, message: "Invalid OTP" };
        }

        otp_cache.delete(email); // ✅ Delete OTP after successful verification
        return { success: true, message: "OTP verified successfully" };
    } catch (err) {
        return { success: false, message: "Invalid or expired token" };
    }
};

// **Compare Passwords**
const compare_passwords = async (plain_password, hashed_password) => {
    try {
        return await bcrypt.compare(plain_password, hashed_password);
    } catch (err) {
        console.error("❌ Error comparing passwords:", err);
        return false;
    }
};

module.exports = { generate_token, generate_otp, verify_otp, compare_passwords };
