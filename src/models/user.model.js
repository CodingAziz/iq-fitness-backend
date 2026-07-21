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
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
