const mongoose = require('mongoose');

const job_schema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        skills: { type: [String], required: true },
        department: { type: String, required: true, trim: true }, // ✅ Added Department
        location: { type: String, required: true, trim: true },
        salary: { type: Number, default: 0 }, // ✅ Changed to Number
        hiring_manager: { type: String, required: true, trim: true }, // ✅ Added Hiring Manager
        status: { type: String, enum: ['active', 'inactive', 'closed', 'filled'], default: 'active' }, // ✅ Added Job Status
        company: { type: String, required: true, trim: true }, // ✅ Added Company Name
        posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

// ✅ Indexing for faster searches
job_schema.index({ title: 1, location: 1, department: 1 });

const Job = mongoose.model('Job', job_schema);

module.exports = Job;
