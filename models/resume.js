const mongoose = require('mongoose');

const resume_schema = new mongoose.Schema(
    {
        candidate_name: { type: String, required: true, trim: true },
        job_role: { type: String, required: true, trim: true }, // Example: Software Engineer
        email: { type: String, required: true, unique: true, trim: true },
        phone: { type: String, required: true, trim: true },
        resume_url: { type: String, required: true, trim: true }, // Resume file URL
        pinned: { type: Boolean, default: false }, // To track if pinned
    },
    { timestamps: true }
);

const Resume = mongoose.model('Resume', resume_schema);
module.exports = Resume;
