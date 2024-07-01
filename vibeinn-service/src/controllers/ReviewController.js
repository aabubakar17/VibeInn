// controllers/reviewController.js
import ReviewService from "../services/reviewService.js";
import { validationResult } from "express-validator";

export default class ReviewController {
  #service;
  constructor(reviewService = new ReviewService()) {
    this.#service = reviewService;
  }

  handleValidationError = (res, errors) => {
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }
  };

  submitReview = async (req, res) => {
    const errors = validationResult(req);
    this.handleValidationError(res, errors);

    try {
      const { reviewText, accommodationId } = req.body;
      const userId = req.user.id;

      const newReview = await this.#service.submitReview(
        userId,
        accommodationId,
        reviewText
      );

      res.status(201).json({
        message: "Review submitted successfully",
        review: newReview,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };

  updateReview = async (req, res) => {
    const errors = validationResult(req);
    this.handleValidationError(res, errors);

    try {
      const { reviewText, reviewId } = req.body;
      const userId = req.user.id;

      const updatedReview = await this.#service.updateReview(
        userId,
        reviewId,
        reviewText
      );

      res.status(200).json({
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({
        message: error.message,
      });
    }
  };
}
