import mongoose from "mongoose";

const refreshSessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    tokenHash: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
}, { timestamps: true });

refreshSessionSchema.index({ userId: 1 });
refreshSessionSchema.index({ tokenHash: 1 }, { unique: true });

export const refreshSession = mongoose.model("RefreshSession", refreshSessionSchema);