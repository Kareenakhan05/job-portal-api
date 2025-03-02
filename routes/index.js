const express = require('express');
const router = express.Router();

// Import all routes file

const recruiterProfileRoutes = require('./recruiter/profile');
const userProfileRoutes = require('./user/profile');
const userJobRoutes = require('./user/job_management');
const recruiterJobRoutes = require('./recruiter/job_management');
const AuthRoutes = require('./admin/auth');
const adminDashboardRoutes = require('./admin/dashboard');
const manageRecruitersRoutes = require('./admin/manage_recruiters');
const teamRoutes = require('./admin/team_management');
const subscriptionRoutes = require('./admin/subscription');
const cmsRoutes = require('./admin/cms');  // ✅ Added CMS Routes
const subAdminRoutes = require('./admin/sub_admin'); // ✅ Added Sub-Admin Routes
const recruiterDashboardRoutes = require('./admin/dashboard');
const recruitSectionRoutes = require('./recruiter/recruit_section'); // added recruit section routes
const jobOpeningRoutes = require('./recruiter/job_opening'); // ✅ job_opening_routes
const resumeRoutes = require('./recruiter/resume'); // resume routes

// Assign routes with base paths

router.use('/api/recruiter/profile', recruiterProfileRoutes);
router.use('/api/user/profile', userProfileRoutes);
router.use('/api/user/jobs', userJobRoutes);
router.use('/api/recruiter/jobs', recruiterJobRoutes);
router.use('/api/auth', AuthRoutes);
router.use('/api/admin/dashboard', adminDashboardRoutes);
router.use('/api/admin/recruiters', manageRecruitersRoutes);
router.use('/api/admin/team', teamRoutes);
router.use('/api/admin/subscriptions', subscriptionRoutes);  
router.use('/api/admin/cms', cmsRoutes);  // ✅ Integrated CMS Routes
router.use('/api/admin/sub-admins', subAdminRoutes); // ✅ Integrated Sub-Admin Routes
router.use('/api/recruiter/dashboard', recruiterDashboardRoutes);
router.use('/recruit-section', recruitSectionRoutes); //Integrated recruit section routes
router.use('/api/dashboard/recruiter/job-openings', jobOpeningRoutes); // ✅ job opening route
router.use('/api/dashboard/recruiter/resumes', resumeRoutes); //resume route





// Handle Undefined Routes
router.use((req, res) => res.status(404).json({ status: 404, message: 'Route not found' }));

module.exports = router;
