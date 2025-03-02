const { validationResult } = require('express-validator');
const User = require('../../models/user');
const { hash_password, compare_password } = require('../../services/auth');
const { sendResponse } = require('../../middlewares/responseMiddleware');

//  Create Profile
const create_profile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendResponse(res, 400, 'Validation error', errors.array());

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

//  Get Profile (by User ID)
const get_profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

//  Update Profile
const update_profile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendResponse(res, 400, 'Validation error', errors.array());

        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        if (!user) return sendResponse(res, 404, 'Profile not found');

        sendResponse(res, 200, 'Profile updated successfully', user);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

//  Change Password
const change_password = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return sendResponse(res, 404, 'User not found');

        const isMatch = await compare_password(current_password, user.password);
        if (!isMatch) return sendResponse(res, 400, 'Current password is incorrect');

        user.password = await hash_password(new_password);
        await user.save();

        sendResponse(res, 200, 'Password changed successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

//  Upload Profile Picture
const upload_profile_photo_controller = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return sendResponse(res, 400, 'No file uploaded');

        const user = await User.findById(req.user.id);
        if (!user) return sendResponse(res, 404, 'User not found');

        user.profile_picture = file.path;
        await user.save();

        sendResponse(res, 200, 'Profile photo uploaded successfully', user.profile_picture);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

//  Upload Resume
const upload_resume_controller = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return sendResponse(res, 400, 'No file uploaded');

        const user = await User.findById(req.user.id);
        if (!user) return sendResponse(res, 404, 'User not found');

        user.resume = file.path;
        await user.save();

        sendResponse(res, 200, 'Resume uploaded successfully', user.resume);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
};

module.exports = {
    create_profile,
    get_profile,
    update_profile,
    change_password,
    upload_profile_photo_controller,
    upload_resume_controller
};
