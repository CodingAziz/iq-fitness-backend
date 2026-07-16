import mongoose from "mongoose";

const dietSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
    fat: {
        type: Number,
        required: true,
    },
    meals: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Diet = mongoose.model("Diet", dietSchema);