import mongoose from "mongoose";

const userProfileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer Not To Say"],
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
    enum: ["Lose Fat", "Build Muscle", "Maintain Weight", "Body Recomposition", "Increase Strength", "Improve Endurance"],
  },
  activityLevel: {
    type: String,
    enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Athlete"],
  },
  workoutExperience: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  workoutDaysPerWeek: {
    type: Number,
    enum: [3, 4, 5, 6],
  },
  preferredWorkoutLocation: {
    type: String,
    enum: ["Gym", "Home"],
  },
  dietPreferences: {
    type: String,
    enum: ["Veg", "Non Veg", "Vegan", "Jain", "Eggetarian"],
  },
  mealsPerDay: {
    type: Number,
    enum: [2, 3, 4, 5, 6],
  },
  injuries: {
    type: [String],
  },
  foodAllergies: {
    type: [String],
  },
  profileVersion: {
    type: Number,
  },
}, { timestamps: true });

export const UserProfile = mongoose.model("UserProfile", userProfileSchema);