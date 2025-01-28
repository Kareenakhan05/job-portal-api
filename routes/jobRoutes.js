import { Router } from 'express';
import {
    postJob,
    getRecruiterJobs,
    getJobDetails,
    updateJob,
    deleteJob,
    searchJobs,
    applyForJob,
    getJobApplications
} from '../controllers/jobController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Route to post a job (Only accessible by recruiters)
router.post('/post-job', authenticate, postJob);

// Route to get all jobs posted by a recruiter (Only accessible by recruiters)
router.get('/recruiter-jobs', authenticate, getRecruiterJobs);

// Route to get details of a specific job (Accessible by users)
router.get('/job/:jobId', authenticate, getJobDetails);

// Route to update a job post (Only accessible by the recruiter who posted the job)
router.put('/update-job/:jobId', authenticate, updateJob);

// Route to delete a job post (Only accessible by the recruiter who posted the job)
router.delete('/delete-job/:jobId', authenticate, deleteJob);

// Route to search jobs (Accessible by all users)
router.get('/search-jobs', authenticate, searchJobs);

// Route for users to apply for a job (Accessible by authenticated users)
router.post('/apply-job/:jobId', authenticate, applyForJob);

// Route to get applications for a specific job (Only accessible by the recruiter who posted the job)
router.get('/job-applications/:jobId', authenticate, getJobApplications);

export default router;
