const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: String,
    skills: [String],  // ['Frontend', 'Backend', 'API Handler']
    applied_jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
});

module.exports = mongoose.model('Candidate', CandidateSchema);
