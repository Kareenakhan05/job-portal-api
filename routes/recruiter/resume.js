const express = require('express');
const router = express.Router();
const { get_resumes, issue_offer_letter, view_resume, toggle_pin_resume } = require('../../controllers/recruiter/resume');
const { auth_middleware } = require('../../middlewares/auth_middleware');
const { validate_fetch_resumes, validate_issue_offer, validate_view_resume, validate_toggle_pin, validate_request } = require('../../validators/recruiter/resume');

// ✅ Fetch all resumes with optional filters (job role, search query)
router.get('/', auth_middleware, validate_fetch_resumes, validate_request, get_resumes);

// ✅ Issue Offer Letter
router.post('/issue-offer', auth_middleware, validate_issue_offer, validate_request, issue_offer_letter);

// ✅ View Resume (Fetch single resume)
router.get('/:candidate_id', auth_middleware, validate_view_resume, validate_request, view_resume);

// ✅ Pin/Unpin Resume
router.patch('/toggle-pin', auth_middleware, validate_toggle_pin, validate_request, toggle_pin_resume);

module.exports = router;
