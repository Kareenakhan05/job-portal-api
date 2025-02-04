

const otpCache = new Map(); // In-memory OTP storage

// Set OTP with expiry
const setOTP = (email, otp, expiryInMinutes = 5) => {
    const expiryTime = Date.now() + expiryInMinutes * 60 * 1000;
    otpCache.set(email, { otp, expiryTime });
};

// Get OTP
const getOTP = (email) => {
    return otpCache.get(email);
};

// Delete OTP
const deleteOTP = (email) => {
    otpCache.delete(email);
};

// Check if OTP is expired
const isOTPExpired = (email) => {
    const data = otpCache.get(email);
    return !data || Date.now() > data.expiryTime;
};

module.exports = { setOTP, getOTP, deleteOTP, isOTPExpired };
