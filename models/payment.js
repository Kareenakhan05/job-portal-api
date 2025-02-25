const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    recruiter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' },
    amount: Number,
    payment_date: Date
});

module.exports = mongoose.model('Payment', PaymentSchema);
