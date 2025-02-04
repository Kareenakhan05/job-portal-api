const Job = require('../../models/job');
const { validationResult } = require('express-validator');
const { send_response } = require('../../middlewares/responseMiddleware'); // Centralized response handler
const { compare_password, generate_token } = require('../../helpers/auth_helpers'); // Helper functions

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

        return send_response(res, 200, 'Jobs retrieved successfully', jobs);
    } catch (error) {
        return send_response(res, 500, 'Server error', error.message);
    }
}

// Apply for Job
async function apply_for_job(req, res) {
    try {
        const { user_id } = req.user;
        const { job_id } = req.params;

        const job = await Job.findById(job_id);
        if (!job) return send_response(res, 404, 'Job not found');

        if (job.applicants.includes(user_id)) {
            return send_response(res, 400, 'You have already applied for this job');
        }

        job.applicants.push(user_id);
        await job.save();

        return send_response(res, 200, 'Application submitted successfully');
    } catch (error) {
        return send_response(res, 500, 'Server error', error.message);
    }
}

// Get Job Details
async function get_job_details(req, res) {
    try {
        const { job_id } = req.params;

        const job = await Job.findById(job_id).populate('posted_by', 'name email');
        if (!job) return send_response(res, 404, 'Job not found');

        return send_response(res, 200, 'Job details retrieved successfully', job);
    } catch (error) {
        return send_response(res, 500, 'Server error', error.message);
    }
}

module.exports = { search_jobs, apply_for_job, get_job_details };
