import { check, validationResult } from 'express-validator';
import Job from '../models/job.js';
import User from '../models/user.js';

// Helper function for standardized responses
const sendResponse = (res, status, message, data = null) => {
    return res.status(status).json({
        message,
        data
    });
};

// Helper function to check if a job exists
const checkJobExists = async (jobId) => {
    return await Job.findById(jobId);
};

// Post a Job
export async function post_job(req, res) {
    try {
        const { id: recruiter_id } = req.user; // Extract recruiter ID from token
        const { title, description, skills, location, salary } = req.body;

        // Validate incoming data
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
export async function get_recruiter_jobs(req, res) {
    try {
        const { id: recruiter_id } = req.user;

        const jobs = await Job.find({ posted_by: recruiter_id });
        sendResponse(res, 200, 'Jobs retrieved successfully', jobs);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Job Details
export async function get_job_details(req, res) {
    try {
        const { job_id } = req.params;

        const job = await checkJobExists(job_id).populate('posted_by', 'name email'); // Populating recruiter details
        if (!job) {
            return sendResponse(res, 404, 'Job not found');
        }

        sendResponse(res, 200, 'Job details retrieved successfully', job);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Update a Job Post
export async function update_job(req, res) {
    try {
        const { job_id } = req.params;
        const { title, description, skills, location, salary } = req.body;

        const updatedJob = await checkJobExists(job_id);
        if (!updatedJob) return sendResponse(res, 404, 'Job not found');

        updatedJob.title = title || updatedJob.title;
        updatedJob.description = description || updatedJob.description;
        updatedJob.skills = skills || updatedJob.skills;
        updatedJob.location = location || updatedJob.location;
        updatedJob.salary = salary || updatedJob.salary;

        await updatedJob.save();
        sendResponse(res, 200, 'Job updated successfully', updatedJob);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Delete a Job Post
export async function delete_job(req, res) {
    try {
        const { job_id } = req.params;

        const deletedJob = await Job.findByIdAndDelete(job_id);
        if (!deletedJob) return sendResponse(res, 404, 'Job not found');

        sendResponse(res, 200, 'Job deleted successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Search Jobs (for Users)
export async function search_jobs(req, res) {
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

// Apply for a Job
export async function apply_for_job(req, res) {
    try {
        const { user_id } = req.user; // Assuming the user ID is available from the token
        const { job_id } = req.params;

        const job = await checkJobExists(job_id);
        if (!job) return sendResponse(res, 404, 'Job not found');

        // Check if the user has already applied for the job
        if (job.applicants.includes(user_id)) {
            return sendResponse(res, 400, 'You have already applied for this job');
        }

        // Add the user to the job's applicants list
        job.applicants.push(user_id);
        await job.save();

        sendResponse(res, 200, 'Application submitted successfully');
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Get Job Applications (for Recruiters)
export async function get_job_applications(req, res) {
    try {
        const { job_id } = req.params;

        const job = await checkJobExists(job_id).populate('applicants');
        if (!job) return sendResponse(res, 404, 'Job not found');

        sendResponse(res, 200, 'Job applications retrieved successfully', job.applicants);
    } catch (err) {
        sendResponse(res, 500, 'Server error', err.message);
    }
}

// Validation Middleware (using express-validator)
export const validatePostJob = [
    check('title').notEmpty().withMessage('Title is required'),
    check('description').notEmpty().withMessage('Description is required'),
    check('skills').notEmpty().withMessage('Skills are required'),
    check('location').notEmpty().withMessage('Location is required'),
    check('salary').isNumeric().withMessage('Salary should be a number'),
];

export const validateSearchJobs = [
    check('keyword').notEmpty().withMessage('Search keyword is required')
];
