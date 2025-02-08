const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user_schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            match: [/^\d{10}$/, 'Phone number must be 10 digits'],
        },
        address: {
            type: String,
            default: null,
            trim: true,
        },
        bio: {
            type: String,
            default: null,
            trim: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        experience: {
            type: String,
            default: null,
            trim: true,
        },
        qualification: {
            type: String,
            default: null,
            trim: true,
        },
        resume: {
            type: String,
            default: null,
        },
        profile_picture: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['job_seeker', 'recruiter', 'admin'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// ✅ Indexing for faster searches
user_schema.index({ email: 1 });

// ✅ Hash password before saving
user_schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ✅ Method to compare passwords
user_schema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', user_schema);

module.exports = User;
