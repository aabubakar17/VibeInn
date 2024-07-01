import ReviewController from "../src/controllers/ReviewController.js";
import sinon from "sinon";

describe("ReviewController", () => {
  describe("submitReview", () => {
    it("should submit a review", async () => {
      const reviewService = {
        submitReview: sinon
          .stub()
          .resolves({ id: 1, reviewText: "Great hotel" }),
      };
      const req = {
        body: {
          reviewText: "Great hotel",
          accommodationId: "1",
        },
        user: {
          id: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.submitReview(req, res);

      sinon.assert.calledWith(res.status, 201);
      sinon.assert.calledWith(res.json, {
        message: "Review submitted successfully",
        review: { id: 1, reviewText: "Great hotel" },
      });
    });

    it("should return a 500 error if the review submission fails", async () => {
      const reviewService = {
        submitReview: sinon
          .stub()
          .rejects(new Error("Failed to submit review")),
      };
      const req = {
        body: {
          reviewText: "Great hotel",
          accommodationId: "1",
        },
        user: {
          id: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.submitReview(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, {
        message: "Failed to submit review",
      });
    });
  });
  describe("updateReview", () => {
    it("should update a review", async () => {
      const reviewService = {
        updateReview: sinon
          .stub()
          .resolves({ id: 1, reviewText: "Great hotel" }),
      };
      const req = {
        body: {
          reviewText: "Great hotel",
          reviewId: "1",
        },
        user: {
          id: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.updateReview(req, res);

      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, {
        message: "Review updated successfully",
        review: { id: 1, reviewText: "Great hotel" },
      });
    });

    it("should return a 500 error if the review update fails", async () => {
      const reviewService = {
        updateReview: sinon
          .stub()
          .rejects(new Error("Failed to update review")),
      };
      const req = {
        body: {
          reviewText: "Great hotel",
          reviewId: "1",
        },
        user: {
          id: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.updateReview(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, {
        message: "Failed to update review",
      });
    });
  });

  describe("deleteReview", () => {
    it("should delete a review", async () => {
      const reviewService = {
        deleteReview: sinon.stub().resolves({ id: 1 }),
      };
      const req = {
        body: {
          reviewId: "1",
        },
        user: {
          id: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.deleteReview(req, res);

      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, {
        message: "Review deleted successfully",
      });
    });

    it("should return a 500 error if the review deletion fails", async () => {
      const reviewService = {
        deleteReview: sinon
          .stub()
          .rejects(new Error("Failed to delete review")),
      };
      const req = {
        body: {
          reviewId: "1",
        },
        user: {
          id: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.deleteReview(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, {
        message: "Failed to delete review",
      });
    });
  });

  describe("getReviewsByUserId", () => {
    it("should get reviews by user ID", async () => {
      const reviewService = {
        getReviewsByUserId: sinon
          .stub()
          .resolves([{ id: 1, reviewText: "Great hotel" }]),
      };
      const req = {
        params: {
          userId: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.getReviewsByUserId(req, res);

      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, [{ id: 1, reviewText: "Great hotel" }]);
    });

    it("should return a 500 error if fetching reviews fails", async () => {
      const reviewService = {
        getReviewsByUserId: sinon
          .stub()
          .rejects(new Error("Failed to fetch reviews")),
      };
      const req = {
        params: {
          userId: "1",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const reviewController = new ReviewController(reviewService);
      await reviewController.getReviewsByUserId(req, res);

      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, {
        message: "Failed to fetch reviews",
      });
    });
  });
});
