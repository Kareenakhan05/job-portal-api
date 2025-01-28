import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    bio: {
        type: String,
    },
    skills: {
        type: [String],
    },
    experience: {
        type: String,
    },
    qualification: {
        type: String,
    },
    resume: { // This stores the path or URL for the resume file
        type: String,
    },
    profilePicture: { // This stores the path or URL for the profile photo
        type: String,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
