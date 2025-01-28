import User from '../models/user.js';
import { comparePassword, hashPassword } from '../services/authService.js';
import { uploadProfilePhoto, uploadResume } from '../services/fileUploadService.js';

// Create Profile
export async function createProfile(req, res) {
    try {
        const { email, name, phone, address, bio } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Profile already exists' });

        const user = new User({ email, name, phone, address, bio });
        await user.save();

        res.status(201).json({ message: 'Profile created successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get Profile
export async function getProfile(req, res) {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email }).select('-password');
        if (!user) return res.status(404).json({ message: 'Profile not found' });

        res.status(200).json({ message: 'Profile retrieved successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Update Profile
export async function updateProfile(req, res) {
    try {
        const { email } = req.params;
        const updates = req.body;

        const user = await User.findOneAndUpdate({ email }, updates, { new: true });
        if (!user) return res.status(404).json({ message: 'Profile not found' });

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Change Password
export async function changePassword(req, res) {
    try {
        const { email, currentPassword, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Create or Update Profile (Upsert)
export async function upsertProfile(req, res) {
    try {
        const { id } = req.user; // Assuming the user ID is available from the token
        const { skills, experience, qualification, bio } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { skills, experience, qualification, bio },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Profile updated successfully', profile: user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get Profile by ID
export async function getProfileById(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Profile not found' });

        res.status(200).json({ message: 'Profile retrieved successfully', profile: user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Upload Profile Picture
export async function uploadProfilePhotoController(req, res) {
    try {
        const userId = req.user.id;  // Assuming authentication middleware is applied and user ID is available from the token
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete the old profile picture if it exists (optional)
        if (user.profilePicture) {
            // Optionally, delete the old profile picture from file system or cloud storage
        }

        // Save the new profile picture path in the database
        user.profilePicture = file.path;  // Store the file path or URL
        await user.save();

        res.status(200).json({ message: 'Profile photo uploaded successfully', profilePicture: user.profilePicture });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Upload Resume
export async function uploadResumeController(req, res) {
    try {
        const userId = req.user.id;  // Assuming authentication middleware is applied and user ID is available from the token
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Save the new resume path in the database
        user.resume = file.path;  // Store the file path or URL
        await user.save();

        res.status(200).json({ message: 'Resume uploaded successfully', resume: user.resume });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get Profile Photo
export async function getProfilePhoto(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('profilePicture');
        if (!user || !user.profilePicture) {
            return res.status(404).json({ message: 'Profile photo not found' });
        }

        res.status(200).json({ message: 'Profile photo retrieved successfully', profilePicture: user.profilePicture });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get Resume
export async function getResume(req, res) {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('resume');
        if (!user || !user.resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json({ message: 'Resume retrieved successfully', resume: user.resume });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
