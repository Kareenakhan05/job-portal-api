import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    bio: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

export default model('User', userSchema);
