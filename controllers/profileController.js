import { check, validationResult } from 'express-validator';
import User from '../models/user.js';
import { generate_token, hash_password, compare_password } from '../services/authService.js';
import { upload_profile_photo, upload_resume } from '../services/fileUploadService.js';

// Helper Function for Standardized Responses
const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        message,
        data
    });
};

// Create Profile
export async function create_profile(req, res) {
    try {
        // Validate incoming data
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return sendResponse(res, 400, 'Validation error', validationErrors.array());
        }

        const { email, name, phone, address, bio } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return sendResponse(res, 400, 'Profile already exists');

        const user = new User({ email, name, phone, address, bio });
        await user.save();

        sendResponse(res, 201, 'Profile created successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Profile
export async function get_profile(req, res) {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select('-password');
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Update Profile
export async function update_profile(req, res) {
    try {
        const { email } = req.params;
        const updates = req.body;

        const user = await User.findOneAndUpdate({ email }, updates, { new: true });
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile updated successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Change Password
export async function change_password(req, res) {
    try {
        const { email, current_password, new_password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return sendResponse(res, 404, 'User not found');

        const isMatch = await comparePassword(current_password, user.password);
        if (!isMatch) return sendResponse(res, 400, 'Current password is incorrect');

        const hashedPassword = await hashPassword(new_password);
        user.password = hashedPassword;
        await user.save();

        sendResponse(res, 200, 'Password changed successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Create or Update Profile (Upsert)
export async function upsert_profile(req, res) {
    try {
        const { id } = req.user; // Assuming the user ID is available from the token
        const { skills, experience, qualification, bio } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { skills, experience, qualification, bio },
            { new: true, upsert: true }
        );

        sendResponse(res, 200, 'Profile updated successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Profile by ID
export async function get_profile_by_id(req, res) {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id).select('-password');
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Upload Profile Picture
export async function upload_profile_photo_controller(req, res) {
    try {
        const user_id = req.user.id; // Assuming authentication middleware is applied
        const file = req.file;

        if (!file) {
            return sendResponse(res, 400, 'No file uploaded');
        }

        // Find the user
        const user = await User.findById(user_id);
        if (!user) return sendResponse(res, 404, 'User not found');

        // Optionally delete old profile picture
        if (user.profile_picture) {
            // Delete old profile picture logic
        }

        user.profile_picture = file.path;
        await user.save();

        sendResponse(res, 200, 'Profile photo uploaded successfully', user.profile_picture);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Upload Resume
export async function upload_resume_controller(req, res) {
    try {
        const user_id = req.user.id;
        const file = req.file;

        if (!file) {
            return sendResponse(res, 400, 'No file uploaded');
        }

        const user = await User.findById(user_id);
        if (!user) return sendResponse(res, 404, 'User not found');

        user.resume = file.path;
        await user.save();

        sendResponse(res, 200, 'Resume uploaded successfully', user.resume);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Profile Photo
export async function get_profile_photo(req, res) {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id).select('profile_picture');
        if (!user || !user.profile_picture) {
            return sendResponse(res, 404, 'Profile photo not found');
        }

        sendResponse(res, 200, 'Profile photo retrieved successfully', user.profile_picture);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Resume
export async function get_resume(req, res) {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id).select('resume');
        if (!user || !user.resume) {
            return sendResponse(res, 404, 'Resume not found');
        }

        sendResponse(res, 200, 'Resume retrieved successfully', user.resume);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Validation Middleware (using express-validator)
export const validateCreateUser = [
    check('first_name').notEmpty().withMessage('First name is required'),
    check('last_name').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
];
