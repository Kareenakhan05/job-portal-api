import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Use bcryptjs for compatibility with ES modules

// Generate a JWT token
export function generateToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in environment variables");
    }
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Hash a password
export async function hashPassword(password) {
    if (!password) {
        throw new Error("Password cannot be empty");
    }
    return await bcrypt.hash(password, 10);
}

// Compare a password with its hashed version
export async function comparePassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
        throw new Error("Password and hashed password cannot be empty");
    }
    return await bcrypt.compare(password, hashedPassword);
}
