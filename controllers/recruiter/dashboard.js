const { validationResult } = require('express-validator');
const Candidate = require('../../models/Candidate');
const Job = require('../../models/job');
const Interview = require('../../models/Interview');
const Payment = require('../../models/Payment');

// ✅ Controller Function for Recruiter Dashboard
const get_recruiter_dashboard = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: 400, errors: errors.array() });
        }

        const recruiter_id = req.user.id; // Assuming JWT middleware sets `req.user`

        // ✅ Fetch Total Candidates
        const total_candidates = await Candidate.countDocuments({ applied_jobs: { $exists: true, $ne: [] } });

        // ✅ Fetch Total Jobs Posted by Recruiter
        const total_jobs = await Job.countDocuments({ recruiter_id });

        // ✅ Fetch Upcoming Interviews
        const upcoming_interviews = await Interview.find({ 
            recruiter_id, 
            interview_date: { $gte: new Date() } 
        }).select('candidate_name interview_date job_title');

        // ✅ Fetch Job Seeker Stats for Pie Chart
        const job_seeker_stats = await Candidate.aggregate([
            { $unwind: "$skills" },
            { $group: { _id: "$skills", count: { $sum: 1 } } }
        ]);

        const formatted_job_seeker_stats = job_seeker_stats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        // ✅ AI-Powered Insights (Static for Now)
        const ai_insights = {
            recommendation: "Increase job postings in Backend Development.",
            trending_skills: ["Node.js", "React", "GraphQL"]
        };

        // ✅ Fetch Income Overview Data
        const income_overview = await Payment.aggregate([
            { $match: { recruiter_id } },
            { $group: { _id: { $month: "$payment_date" }, earnings: { $sum: "$amount" } } },
            { $sort: { _id: 1 } }
        ]);

        const formatted_income_overview = {
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            earnings: Array(12).fill(0)
        };

        income_overview.forEach(data => {
            formatted_income_overview.earnings[data._id - 1] = data.earnings;
        });

        return res.status(200).json({
            status: 200,
            message: "Recruiter Dashboard Data Fetched Successfully",
            data: {
                total_candidates,
                total_jobs,
                upcoming_interviews,
                job_seeker_stats: formatted_job_seeker_stats,
                ai_insights,
                income_overview: formatted_income_overview
            }
        });

    } catch (error) {
        console.error("Error fetching recruiter dashboard data:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

module.exports = { get_recruiter_dashboard };
