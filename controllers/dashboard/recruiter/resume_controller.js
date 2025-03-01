const Resume = require('../../../models/resume');
const responseHelper = require('../../../helpers/response_helpers');

// ✅ Fetch all resumes based on job roles or search query
const get_resumes = async (req, res) => {
    try {
        const { role, search } = req.query;

        let filter = {};
        if (role) filter.job_role = role; // Filter by job role
        if (search) filter.candidate_name = { $regex: search, $options: 'i' }; // Search by name

        const resumes = await Resume.find(filter);
        return responseHelper.success(res, 'Resumes fetched successfully', resumes);
    } catch (error) {
        return responseHelper.error(res, 'Failed to fetch resumes', error);
    }
};

// ✅ Issue Offer Letter
const issue_offer_letter = async (req, res) => {
    try {
        const { candidate_id, offer_type } = req.body;

        if (!['standard', 'internship', 'contract'].includes(offer_type)) {
            return responseHelper.bad_request(res, 'Invalid offer type');
        }

        const resume = await Resume.findById(candidate_id);
        if (!resume) {
            return responseHelper.not_found(res, 'Candidate not found');
        }

        // Here, you would generate an offer letter (PDF, Email, etc.)
        return responseHelper.success(res, `Offer letter issued for ${resume.candidate_name}`, { offer_type });
    } catch (error) {
        return responseHelper.error(res, 'Failed to issue offer letter', error);
    }
};

// ✅ View Resume (Fetch single resume)
const view_resume = async (req, res) => {
    try {
        const { candidate_id } = req.params;

        const resume = await Resume.findById(candidate_id);
        if (!resume) {
            return responseHelper.not_found(res, 'Resume not found');
        }

        return responseHelper.success(res, 'Resume fetched successfully', resume);
    } catch (error) {
        return responseHelper.error(res, 'Failed to fetch resume', error);
    }
};

// ✅ Pin/Unpin Resume
const toggle_pin_resume = async (req, res) => {
    try {
        const { candidate_id } = req.body;

        const resume = await Resume.findById(candidate_id);
        if (!resume) {
            return responseHelper.not_found(res, 'Resume not found');
        }

        resume.pinned = !resume.pinned;
        await resume.save();

        return responseHelper.success(res, `Resume ${resume.pinned ? 'Pinned' : 'Unpinned'} Successfully`, resume);
    } catch (error) {
        return responseHelper.error(res, 'Failed to update pin status', error);
    }
};

module.exports = { get_resumes, issue_offer_letter, view_resume, toggle_pin_resume };
