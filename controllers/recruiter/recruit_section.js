const db = require('../../database/db'); // Import database connection

// ✅ Fetch all candidates applied for jobs under a recruiter
const get_recruit_section = async (req, res) => {
    try {
        const recruiter_id = req.user.id; // Assuming recruiter ID comes from auth middleware
        
        // Fetch candidates applied to the recruiter's jobs
        const candidates = await db.query(`
            SELECT c.id, c.name, c.email, c.phone, c.status, j.title AS job_title
            FROM candidates c
            JOIN jobs j ON c.job_id = j.id
            WHERE j.recruiter_id = ?
        `, [recruiter_id]);

        return res.status(200).json({
            success: true,
            message: "Recruit section data retrieved successfully",
            data: candidates
        });

    } catch (error) {
        console.error("Error fetching recruit section data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Update candidate's hiring status
const update_candidate_status = async (req, res) => {
    try {
        const { candidate_id, status } = req.body;
        const recruiter_id = req.user.id;

        // Update candidate status if the job belongs to this recruiter
        const result = await db.query(`
            UPDATE candidates c
            JOIN jobs j ON c.job_id = j.id
            SET c.status = ?
            WHERE c.id = ? AND j.recruiter_id = ?
        `, [status, candidate_id, recruiter_id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Candidate not found or unauthorized" });
        }

        return res.status(200).json({ success: true, message: "Candidate status updated successfully" });

    } catch (error) {
        console.error("Error updating candidate status:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { get_recruit_section, update_candidate_status };
