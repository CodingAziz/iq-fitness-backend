import mongoose from "mongoose";

const userSubscriptionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
  },
  plan: {
    type: String,
    enum: ["Free", "Diet", "Premium", "Pro"],
  },
  status: {
    type: String,
    enum: ["Active", "Expired"],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
}, { timestamps: true });