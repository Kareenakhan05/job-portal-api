import pkg from 'lru-cache';
const { default: LRU } = pkg;

// Initialize the LRU cache with a max size and TTL (time-to-live)
const otp_cache = new LRU({
    max: 100, // Maximum items in cache
    ttl: 1000 * 60 * 5, // Cache expiry time of 5 minutes
});

// Store OTP in cache
export function store_otp(email, otp) {
    try {
        otp_cache.set(email, otp);
    } catch (err) {
        console.error(`Error storing OTP for ${email}:`, err);
        throw new Error('Failed to store OTP. Please try again later.');
    }
}

// Get OTP from cache
export function get_otp(email) {
    try {
        const otp = otp_cache.get(email);
        if (!otp) {
            throw new Error('OTP not found or expired');
        }
        return otp;
    } catch (err) {
        console.error(`Error retrieving OTP for ${email}:`, err);
        throw new Error('Failed to retrieve OTP. Please try again later.');
    }
}

// Delete OTP from cache
export function delete_otp(email) {
    try {
        otp_cache.delete(email);
    } catch (err) {
        console.error(`Error deleting OTP for ${email}:`, err);
        throw new Error('Failed to delete OTP. Please try again later.');
    }
}
