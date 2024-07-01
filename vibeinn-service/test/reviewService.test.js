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

  describe("deleteReview", () => {
    it("should delete a review", async () => {
      const userId = "1";
      const reviewId = "1";

      sinon.stub(Review, "findOneAndDelete").resolves({ id: 1 });

      const deletedReview = await reviewService.deleteReview(userId, reviewId);

      expect(deletedReview).to.deep.equal({ id: 1 });
    });

    it("should throw an error if the review deletion fails", async () => {
      const userId = "1";
      const reviewId = "1";

      sinon.stub(Review, "findOneAndDelete").rejects(new Error());

      try {
        await reviewService.deleteReview(userId, reviewId);
      } catch (err) {
        expect(err.message).to.equal("Error deleting review");
      }
    });
  });

  describe("getReviewsByUserId", () => {
    it("should get reviews by user ID", async () => {
      const userId = "1";

      sinon
        .stub(Review, "find")
        .withArgs({ userId })
        .resolves([{ id: 1, reviewText: "Great hotel" }]);

      const reviews = await reviewService.getReviewsByUserId(userId);

      expect(reviews).to.deep.equal([{ id: 1, reviewText: "Great hotel" }]);
    });

    it("should throw an error if fetching reviews fails", async () => {
      const userId = "1";

      sinon.stub(Review, "find").rejects(new Error());

      try {
        await reviewService.getReviewsByUserId(userId);
      } catch (err) {
        expect(err.message).to.equal("Error fetching reviews");
      }
    });
  });
});
