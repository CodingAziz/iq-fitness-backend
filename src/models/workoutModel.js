import mongoose from 'mongoose';

const workoutSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        required: true,
        level: ["beginner", "intermediate", "advanced"],
    },
    durationWeeks: {
        type: Number,
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Workout = mongoose.model("Workout", workoutSchema);