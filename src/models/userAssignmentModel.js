import mongoose from "mongoose";

const userAssignmentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    workoutId: {
        type: mongoose.Types.ObjectId,
        ref: "Workout",
    },
    dietId: {
        type: mongoose.Types.ObjectId,
        ref: "Diet",
    },
    assignedBy: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
    }
});

export const userAssignment = mongoose.model("UserAssignment", userAssignmentSchema);