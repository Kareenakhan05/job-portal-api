const { validationResult } = require('express-validator');
const Job = require('../../models/job');
const { send_response } = require('../../middlewares/responseMiddleware');

async function post_job(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return send_response(res, 400, 'Validation error', errors.array());
    }

    try {
        const { id: recruiter_id } = req.user;
        const { title, description, skills, location, salary } = req.body;

        const job = new Job({ title, description, skills, location, salary, posted_by: recruiter_id });
        await job.save();
        
        return send_response(res, 201, 'Job posted successfully', job);
    } catch (err) {
        return send_response(res, 500, 'Server error', err.message);
    }
}

async function get_recruiter_jobs(req, res) {
    try {
        const { id: recruiter_id } = req.user;
        const jobs = await Job.find({ posted_by: recruiter_id });
        return send_response(res, 200, 'Jobs retrieved successfully', jobs);
    } catch (err) {
        return send_response(res, 500, 'Server error', err.message);
    }
}

async function update_job(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return send_response(res, 400, 'Validation error', errors.array());
    }

    try {
        const { job_id } = req.params;
        const { id: recruiter_id } = req.user;
        const { title, description, skills, location, salary } = req.body;

        const job = await Job.findById(job_id);
        if (!job) return send_response(res, 404, 'Job not found');
        if (job.posted_by.toString() !== recruiter_id) return send_response(res, 403, 'Unauthorized');

        Object.assign(job, { title, description, skills, location, salary });
        await job.save();

        return send_response(res, 200, 'Job updated successfully', job);
    } catch (err) {
        return send_response(res, 500, 'Server error', err.message);
    }
}

async function delete_job(req, res) {
    try {
        const { job_id } = req.params;
        const { id: recruiter_id } = req.user;

        const job = await Job.findById(job_id);
        if (!job) return send_response(res, 404, 'Job not found');
        if (job.posted_by.toString() !== recruiter_id) return send_response(res, 403, 'Unauthorized');

        await Job.findByIdAndDelete(job_id);
        return send_response(res, 200, 'Job deleted successfully');
    } catch (err) {
        return send_response(res, 500, 'Server error', err.message);
    }
}

async function get_job_applications(req, res) {
    try {
        const { job_id } = req.params;
        const { id: recruiter_id } = req.user;

        const job = await Job.findById(job_id).populate('applicants');
        if (!job) return send_response(res, 404, 'Job not found');
        if (job.posted_by.toString() !== recruiter_id) return send_response(res, 403, 'Unauthorized');

        return send_response(res, 200, 'Job applications retrieved successfully', job.applicants);
    } catch (err) {
        return send_response(res, 500, 'Server error', err.message);
    }
}

module.exports = {
    post_job,
    get_recruiter_jobs,
    update_job,
    delete_job,
    get_job_applications
};
