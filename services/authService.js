import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Use bcryptjs for compatibility with ES modules

// Generate a JWT token
export function generateToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in environment variables");
    }

    // Ensure that the user object contains the required _id property
    if (!user._id) {
        throw new Error("User object must contain _id");
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Hash a password
export async function hashPassword(password) {
    if (!password) {
        throw new Error("Password cannot be empty");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error("Error while hashing password: " + error.message);
    }
}

// Compare a password with its hashed version
export async function comparePassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
        throw new Error("Password and hashed password cannot be empty");
    }

    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error while comparing password: " + error.message);
    }
}
