import { Router } from 'express';
import {
    post_job,
    get_recruiter_jobs,
    get_job_details,
    update_job,
    delete_job,
    search_jobs,
    apply_for_job,
    get_job_applications
} from '../controllers/jobController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Route to post a job (Only accessible by recruiters)
router.post('/post-job', authenticate, post_job);

// Route to get all jobs posted by a recruiter (Only accessible by recruiters)
router.get('/recruiter-jobs', authenticate, get_recruiter_jobs);

// Route to get details of a specific job (Accessible by users)
router.get('/job/:job_id', authenticate, get_job_details);

// Route to update a job post (Only accessible by the recruiter who posted the job)
router.put('/update-job/:job_id', authenticate, update_job);

// Route to delete a job post (Only accessible by the recruiter who posted the job)
router.delete('/delete-job/:job_id', authenticate, delete_job);

// Route to search jobs (Accessible by all users)
router.get('/search-jobs', authenticate, search_jobs);

// Route for users to apply for a job (Accessible by authenticated users)
router.post('/apply-job/:job_id', authenticate, apply_for_job);

// Route to get applications for a specific job (Only accessible by the recruiter who posted the job)
router.get('/job-applications/:job_id', authenticate, get_job_applications);

export default router;
