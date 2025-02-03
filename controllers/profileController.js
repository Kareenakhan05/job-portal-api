const { validationResult } = require('express-validator');
const User = require('../models/user');
const { generate_token, hash_password, compare_password } = require('../services/authService');
const { upload_profile_photo, upload_resume } = require('../services/fileUploadService');
const { sendResponse } = require('../middlewares/responseMiddleware');

// Create Profile
const create_profile = async (req, res) => {
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
};

// Get Profile
const get_profile = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select('-password');
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

// Update Profile
const update_profile = async (req, res) => {
    try {
        const { email } = req.params;
        const updates = req.body;

        const user = await User.findOneAndUpdate({ email }, updates, { new: true });
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile updated successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

// Change Password
const change_password = async (req, res) => {
    try {
        const { email, current_password, new_password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return sendResponse(res, 404, 'User not found');

        const isMatch = await compare_password(current_password, user.password);
        if (!isMatch) return sendResponse(res, 400, 'Current password is incorrect');

        const hashedPassword = await hash_password(new_password);
        user.password = hashedPassword;
        await user.save();

        sendResponse(res, 200, 'Password changed successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

// Create or Update Profile (Upsert)
const upsert_profile = async (req, res) => {
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
};

// Get Profile by ID
const get_profile_by_id = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id).select('-password');
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

// Upload Profile Picture
const upload_profile_photo_controller = async (req, res) => {
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
};

// Upload Resume
const upload_resume_controller = async (req, res) => {
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
};

// Get Profile Photo
const get_profile_photo = async (req, res) => {
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
};

// Get Resume
const get_resume = async (req, res) => {
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
};

// Export the controller functions as an object
module.exports = {
    create_profile,
    get_profile,
    update_profile,
    change_password,
    upsert_profile,
    get_profile_by_id,
    upload_profile_photo_controller,
    upload_resume_controller,
    get_profile_photo,
    get_resume
};
