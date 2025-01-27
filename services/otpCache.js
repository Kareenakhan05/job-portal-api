import pkg from 'lru-cache';
const { default: LRU } = pkg;

const otpCache = new LRU({
    max: 100, // Maximum items
    ttl: 1000 * 60 * 5, // Cache expiry time (5 minutes)
});

export function storeOtp(email, otp) { return otpCache.set(email, otp); }

export function getOtp(email) { return otpCache.get(email); }

export function deleteOtp(email) { return otpCache.delete(email); }
