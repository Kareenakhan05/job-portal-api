const { validationResult } = require('express-validator');
const Job = require('../models/job');
const User = require('../models/user');

// Helper function for standardized responses
const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({ message, data });
};

// Post a Job
async function post_job(req, res) {
    try {
        const { id: recruiter_id } = req.user;
        const { title, description, skills, location, salary } = req.body;

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return sendResponse(res, 400, 'Validation error', validationErrors.array());
        }

        const job = new Job({ title, description, skills, location, salary, posted_by: recruiter_id });
        await job.save();

        sendResponse(res, 201, 'Job posted successfully', job);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Jobs by Recruiter
async function get_recruiter_jobs(req, res) {
    try {
        const { id: recruiter_id } = req.user;

        const jobs = await Job.find({ posted_by: recruiter_id });
        sendResponse(res, 200, 'Jobs retrieved successfully', jobs);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Update a Job
async function update_job(req, res) {
    try {
        const { job_id } = req.params;
        const { title, description, skills, location, salary } = req.body;

        const job = await Job.findById(job_id);
        if (!job) return sendResponse(res, 404, 'Job not found');

        job.title = title || job.title;
        job.description = description || job.description;
        job.skills = skills || job.skills;
        job.location = location || job.location;
        job.salary = salary || job.salary;

        await job.save();
        sendResponse(res, 200, 'Job updated successfully', job);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Delete a Job
async function delete_job(req, res) {
    try {
        const { job_id } = req.params;
        const job = await Job.findByIdAndDelete(job_id);

        if (!job) return sendResponse(res, 404, 'Job not found');

        sendResponse(res, 200, 'Job deleted successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Job Applications
async function get_job_applications(req, res) {
    try {
        const { job_id } = req.params;

        const job = await Job.findById(job_id).populate('applicants');
        if (!job) return sendResponse(res, 404, 'Job not found');

        sendResponse(res, 200, 'Job applications retrieved successfully', job.applicants);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}


module.exports = { 
    post_job, 
    get_recruiter_jobs, 
    update_job, 
    delete_job, 
    get_job_applications 
};
