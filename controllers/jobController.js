import Job from '../models/job.js';
import User from '../models/user.js';  // Assuming you want to link job applications to users

// Post a Job
export async function postJob(req, res) {
    try {
        const { id: recruiterId } = req.user; // Extract recruiter ID from token
        const { title, description, skills, location, salary } = req.body;

        const job = new Job({ title, description, skills, location, salary, postedBy: recruiterId });
        await job.save();

        res.status(201).json({ message: 'Job posted successfully', job });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get Jobs by Recruiter
export async function getRecruiterJobs(req, res) {
    try {
        const { id: recruiterId } = req.user;

        const jobs = await Job.find({ postedBy: recruiterId });
        res.status(200).json({ message: 'Jobs retrieved successfully', jobs });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get Job Details
export async function getJobDetails(req, res) {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId).populate('postedBy', 'name email'); // Populating recruiter details
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job details retrieved successfully', job });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Update a Job Post
export async function updateJob(req, res) {
    try {
        const { jobId } = req.params;
        const { title, description, skills, location, salary } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { title, description, skills, location, salary },
            { new: true }
        );
        if (!updatedJob) return res.status(404).json({ message: 'Job not found' });

        res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Delete a Job Post
export async function deleteJob(req, res) {
    try {
        const { jobId } = req.params;

        const deletedJob = await Job.findByIdAndDelete(jobId);
        if (!deletedJob) return res.status(404).json({ message: 'Job not found' });

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Search Jobs (for Users)
export async function searchJobs(req, res) {
    try {
        const { keyword } = req.query;

        const jobs = await Job.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { skills: { $regex: keyword, $options: 'i' } },
                { location: { $regex: keyword, $options: 'i' } },
            ],
        });

        res.status(200).json({ message: 'Jobs retrieved successfully', jobs });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Apply for a Job
export async function applyForJob(req, res) {
    try {
        const { userId } = req.user; // Assuming the user ID is available from the token
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Check if the user has already applied for the job
        if (job.applicants.includes(userId)) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Add the user to the job's applicants list
        job.applicants.push(userId);
        await job.save();

        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get Job Applications (for Recruiters)
export async function getJobApplications(req, res) {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId).populate('applicants');
        if (!job) return res.status(404).json({ message: 'Job not found' });

        res.status(200).json({ message: 'Job applications retrieved successfully', applicants: job.applicants });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}
