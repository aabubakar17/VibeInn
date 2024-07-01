// services/reviewService.js
import Review from "../models/Review.js";

export default class ReviewService {
  async submitReview(userId, accommodationId, reviewText) {
    try {
      const newReview = await Review.create({
        userId,
        accommodationId,
        text: reviewText,
        publishedDate: new Date(),
      });

      return newReview;
    } catch (error) {
      console.error("Error in ReviewService submitReview:", error);
      throw new Error("Error saving review");
    }
  }
}
