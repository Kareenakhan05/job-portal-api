const Job = require('../../models/job'); // Import Job Model
const { validationResult } = require('express-validator');
const responseHelper = require('../../helpers/response_helpers');

// ✅ Fetch Job Openings
const get_job_openings = async (req, res) => {
    try {
        const recruiter_id = req.user._id; // Get recruiter ID from auth middleware

        const jobs = await Job.find({ recruiter: recruiter_id }).select('-__v'); // Fetch recruiter's jobs

        return responseHelper.success(res, 'Job openings fetched successfully', jobs);
    } catch (error) {
        return responseHelper.error(res, `Failed to fetch job openings: ${error.message}`);
    }
};

// ✅ Edit Job Details
const edit_job_details = async (req, res) => {
    try {
        // Validation Errors Handling
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseHelper.validationError(res, errors.array());
        }

        const { job_id, title, department, location, hiring_manager, status } = req.body;

        const job = await Job.findById(job_id);
        if (!job) {
            return responseHelper.notFound(res, 'Job not found');
        }

        // Ensure the job belongs to the recruiter
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return responseHelper.forbidden(res, 'Unauthorized to edit this job');
        }

        // Update job details
        job.title = title;
        job.department = department;
        job.location = location;
        job.hiring_manager = hiring_manager;
        job.status = status;

        await job.save();

        return responseHelper.success(res, 'Job updated successfully', job);
    } catch (error) {
        return responseHelper.error(res, `Failed to update job: ${error.message}`);
    }
};

module.exports = { get_job_openings, edit_job_details };
