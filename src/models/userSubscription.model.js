import mongoose from "mongoose";

const userSubscriptionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  plan: {
    type: String,
    enum: ["Free", "Premium", "Pro"],
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