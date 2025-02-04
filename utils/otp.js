
const crypto = require("crypto");
const otpCache = require("../services/otpCache");

// Generate a random 6-digit OTP
const generate_OTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Send OTP (Simulated - Replace with actual email/SMS service)
const send_OTP = (email, otp) => {
    console.log(`📩 OTP for ${email}: ${otp}`); // Simulate sending OTP
    return true;
};

// Verify OTP
const verify_OTP = (email, otp) => {
    const cachedOTP = otpCache.getOTP(email);
    if (!cachedOTP) return { success: false, message: "OTP not found" };
    if (otpCache.isOTPExpired(email)) {
        otpCache.deleteOTP(email);
        return { success: false, message: "OTP expired" };
    }
    if (cachedOTP.otp !== otp) return { success: false, message: "Invalid OTP" };

    otpCache.deleteOTP(email); // Delete OTP after successful verification
    return { success: true, message: "OTP verified successfully" };
};

module.exports = { generate_OTP, send_OTP, verify_OTP };
