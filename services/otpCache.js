import pkg from 'lru-cache';
const { default: LRU } = pkg;

// Initialize the LRU cache
const otpCache = new LRU({
    max: 100, // Maximum items in cache
    ttl: 1000 * 60 * 5, // Cache expiry time (5 minutes)
});

// Store OTP in cache
export function storeOtp(email, otp) {
    try {
        otpCache.set(email, otp);
    } catch (err) {
        console.error('Error storing OTP:', err);
        throw new Error('Failed to store OTP. Please try again.');
    }
}

// Get OTP from cache
export function getOtp(email) {
    try {
        const otp = otpCache.get(email);
        if (!otp) {
            throw new Error('OTP not found or expired');
        }
        return otp;
    } catch (err) {
        console.error('Error retrieving OTP:', err);
        throw new Error('Failed to retrieve OTP. Please try again.');
    }
}

// Delete OTP from cache
export function deleteOtp(email) {
    try {
        otpCache.delete(email);
    } catch (err) {
        console.error('Error deleting OTP:', err);
        throw new Error('Failed to delete OTP. Please try again.');
    }
}
