const mongoose = require('mongoose');

const job_schema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        skills: { type: [String], required: true },
        location: { type: String, required: true, trim: true },
        salary: { type: String, default: 'Not Disclosed' },
        posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

// ✅ Indexing for faster searches
job_schema.index({ title: 1, location: 1 });

const Job = mongoose.model('Job', job_schema);

module.exports = Job;
