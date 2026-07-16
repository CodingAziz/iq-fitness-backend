import mongoose, { mongo } from "mongoose";

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    verifyAttempts: {
        type: Number,
        required: true,
        default: 0,
    },
    resendCounts = {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });

export const Otp = mongoose.model("Otp", otpSchema);