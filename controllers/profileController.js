import User from '../models/user.js';

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

        const user = await User.findOne({ email });
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
