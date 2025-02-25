const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
    candidate_name: String,
    job_title: String,
    interview_date: Date
});

module.exports = mongoose.model('Interview', InterviewSchema);
