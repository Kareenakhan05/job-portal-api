const Job = require('../models/job');  // Using require for module import
const { validationResult } = require('express-validator');

// Helper function for standardized responses
const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({ message, data });
};

// Search Jobs
async function search_jobs(req, res) {
    try {
        const { keyword } = req.query;

        const jobs = await Job.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } },
                { location: { $regex: keyword, $options: 'i' } },
            ],
        });

        sendResponse(res, 200, 'Jobs retrieved successfully', jobs);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Apply for Job
async function apply_for_job(req, res) {
    try {
        const { user_id } = req.user;
        const { job_id } = req.params;

        const job = await Job.findById(job_id);
        if (!job) return sendResponse(res, 404, 'Job not found');

        if (job.applicants.includes(user_id)) {
            return sendResponse(res, 400, 'You have already applied for this job');
        }

        job.applicants.push(user_id);
        await job.save();

        sendResponse(res, 200, 'Application submitted successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Job Details
async function get_job_details(req, res) {
    try {
        const { job_id } = req.params;

        const job = await Job.findById(job_id).populate('posted_by', 'name email');
        if (!job) return sendResponse(res, 404, 'Job not found');

        sendResponse(res, 200, 'Job details retrieved successfully', job);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Export functions using module.exports
module.exports = { search_jobs, apply_for_job, get_job_details };
