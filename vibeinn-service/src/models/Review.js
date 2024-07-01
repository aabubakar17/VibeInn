import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accommodationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accommodation",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
