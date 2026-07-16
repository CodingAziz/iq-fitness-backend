import mongoose from "mongoose";

const refreshSessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    tokenHash: {
        type: String,
        required: true,
    },
    device: {
        type: String,
        required: true,
        enum: ["Android", "Iphone"],
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    revoked: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export const refreshSession = mongoose.model("RefreshSession", refreshSessionSchema);