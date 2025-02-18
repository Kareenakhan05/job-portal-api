const CMS = require('../../models/cms');
const { send_response } = require('../../middlewares/responseMiddleware');

// ✅ Fetch CMS Content (Privacy Policy, Terms, About Us)
const get_cms_content = async (req, res) => {
    try {
        const cmsData = await CMS.find();
        return send_response(res, 200, "CMS content fetched successfully", cmsData);
    } catch (error) {
        return send_response(res, 500, "Error fetching CMS content", error.message);
    }
};

// ✅ Update CMS Content (Admin Only)
const update_cms_content = async (req, res) => {
    try {
        const { section_name, content } = req.body;

        if (!['privacy_policy', 'terms_conditions', 'about_us'].includes(section_name)) {
            return send_response(res, 400, "Invalid section name");
        }

        const updatedCMS = await CMS.findOneAndUpdate(
            { section_name },
            { content, updated_at: Date.now() },
            { new: true, upsert: true } // Create if not exists
        );

        return send_response(res, 200, `CMS section '${section_name}' updated successfully`, updatedCMS);
    } catch (error) {
        return send_response(res, 500, "Error updating CMS content", error.message);
    }
};

module.exports = {
    get_cms_content,
    update_cms_content
};
