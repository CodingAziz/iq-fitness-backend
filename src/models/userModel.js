import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
    },
    phone: {
        type: Number,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    height: {
        type: Number,
    },
    currentWeight: {
        type: Number,
    },
    targetWeight: {
        type: Number,
    },
    goal: {
        type: String,
    },
    activityLevel: {
        type: String,
    },
    profilePhoto: {
        type: Image,
    },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
