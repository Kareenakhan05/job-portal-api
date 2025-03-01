const express = require('express');
const router = express.Router();

// Import all routes file
const recruiterAuthRoutes = require('./recruiter/auth_recruiter_routes');
const userAuthRoutes = require('./user/auth_user_routes');
const recruiterProfileRoutes = require('./recruiter/recruiter_profile_routes');
const userProfileRoutes = require('./user/user_profile_routes');
const userJobRoutes = require('./user/user_job_routes');
const recruiterJobRoutes = require('./recruiter/recruiter_job_routes');
const adminAuthRoutes = require('./dashboard/admin/admin_auth_routes');
const adminDashboardRoutes = require('./dashboard/admin/admin_dashboard_routes');
const manageRecruitersRoutes = require('./dashboard/admin/manage_recruiters_routes');
const teamRoutes = require('./dashboard/admin/team_routes');
const subscriptionRoutes = require('./dashboard/admin/subscription_routes');
const cmsRoutes = require('./dashboard/admin/cms_routes');  // ✅ Added CMS Routes
const subAdminRoutes = require('./dashboard/admin/sub_admin_routes'); // ✅ Added Sub-Admin Routes
const recruiterDashboardRoutes = require('./dashboard/recruiter/recruiter_dashboard_routes');
const recruitSectionRoutes = require('./dashboard/recruiter/recruit_section_routes'); // added recruit section routes
const jobOpeningRoutes = require('./dashboard/recruiter/job_opening_routes'); // ✅ job_opening_routes
const resumeRoutes = require('./dashboard/recruiter/resume_routes'); // resume routes

// Assign routes with base paths
router.use('/api/auth/recruiter', recruiterAuthRoutes);
router.use('/api/auth/user', userAuthRoutes);
router.use('/api/recruiter/profile', recruiterProfileRoutes);
router.use('/api/user/profile', userProfileRoutes);
router.use('/api/user/jobs', userJobRoutes);
router.use('/api/recruiter/jobs', recruiterJobRoutes);
router.use('/api/admin/auth', adminAuthRoutes);
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
