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

  async updateReview(userId, reviewId, reviewText) {
    try {
      const updatedReview = await Review.findOneAndUpdate(
        { _id: reviewId, userId },
        { text: reviewText },
        { new: true }
      );

      return updatedReview;
    } catch (error) {
      console.error("Error in ReviewService updateReview:", error);
      throw new Error("Error updating review");
    }
  }

  async deleteReview(userId, reviewId) {
    try {
      const deletedReview = await Review.findOneAndDelete({
        _id: reviewId,
        userId,
      });

      return deletedReview;
    } catch (error) {
      console.error("Error in ReviewService deleteReview:", error);
      throw new Error("Error deleting review");
    }
  }

  async getReviewsByUserId(userId) {
    try {
      const reviews = await Review.find({ userId }); // Populate accommodation details if necessary
      console.log(reviews);
      return reviews;
    } catch (error) {
      console.error("Error in ReviewService getReviewsByUserId:", error);
      throw new Error("Error fetching reviews");
    }
  }
}
