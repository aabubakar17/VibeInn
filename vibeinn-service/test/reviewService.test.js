import ReviewService from "../src/services/reviewService.js";
import sinon from "sinon";
import Review from "../src/models/Review.js";
import { expect } from "chai";

describe("ReviewService", () => {
  let reviewService;

  beforeEach(() => {
    reviewService = new ReviewService();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("submitReview", () => {
    it("should submit a review", async () => {
      const userId = "1";
      const accommodationId = "1";
      const reviewText = "Great hotel";

      sinon
        .stub(Review, "create")
        .resolves({ id: 1, reviewText: "Great hotel" });

      const newReview = await reviewService.submitReview(
        userId,
        accommodationId,
        reviewText
      );

      expect(newReview).to.deep.equal({ id: 1, reviewText: "Great hotel" });
    });

    it("should throw an error if the review submission fails", async () => {
      const userId = "1";
      const accommodationId = "1";
      const reviewText = "Great hotel";

      sinon.stub(Review, "create").rejects(new Error());

      try {
        await reviewService.submitReview(userId, accommodationId, reviewText);
      } catch (err) {
        expect(err.message).to.equal("Error saving review");
      }
    });
  });

  describe("updateReview", () => {
    it("should update a review", async () => {
      const userId = "1";
      const reviewId = "1";
      const reviewText = "Great hotel";

      sinon
        .stub(Review, "findOneAndUpdate")
        .resolves({ id: 1, reviewText: "Great hotel" });

      const updatedReview = await reviewService.updateReview(
        userId,
        reviewId,
        reviewText
      );

      expect(updatedReview).to.deep.equal({ id: 1, reviewText: "Great hotel" });
    });

    it("should throw an error if the review update fails", async () => {
      const userId = "1";
      const reviewId = "1";
      const reviewText = "Great hotel";

      sinon.stub(Review, "findOneAndUpdate").rejects(new Error());

      try {
        await reviewService.updateReview(userId, reviewId, reviewText);
      } catch (err) {
        expect(err.message).to.equal("Error updating review");
      }
    });
  });
});
