const CMS = require('../../../models/cms');
const { send_response } = require('../../../middlewares/responseMiddleware');

// ✅ Fetch CMS Content (Privacy Policy, Terms, About Us)
const get_cms_content = async (req, res) => {
    try {
        const cmsData = await CMS.find({});
        return send_response(res, 200, "CMS content fetched successfully", cmsData);
    } catch (error) {
        return send_response(res, 500, "Error fetching CMS content", { error: error.message });
    }
};

// ✅ Update CMS Content (Admin Only)
const update_cms_content = async (req, res) => {
    try {
        const { section_name, content } = req.body;

        // ✅ Validate section_name from Schema instead of hardcoded array
        const valid_sections = ['privacy_policy', 'terms_conditions', 'about_us'];
        if (!valid_sections.includes(section_name)) {
            return send_response(res, 400, "Invalid section name. Allowed: 'privacy_policy', 'terms_conditions', 'about_us'");
        }

        // ✅ Find and Update CMS Content
        const updatedCMS = await CMS.findOneAndUpdate(
            { section_name },
            { content },  // ✅ No need to manually update `updated_at`
            { new: true, upsert: true } // Create if not exists
        );

        return send_response(res, 200, `CMS section '${section_name}' updated successfully`, updatedCMS);
    } catch (error) {
        return send_response(res, 500, "Error updating CMS content", { error: error.message });
    }
};

module.exports = {
    get_cms_content,
    update_cms_content
};
