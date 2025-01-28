import mongoose from 'mongoose';

const job_schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], required: true },
    location: { type: String, required: true },
    salary: { type: String },
    posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Job = mongoose.model('Job', job_schema);
export default Job;
