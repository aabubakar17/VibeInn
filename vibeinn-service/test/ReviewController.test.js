import ReviewController from "../src/controllers/ReviewController.js";
import sinon from "sinon";

describe("ReviewController", () => {
  it("should submit a review", async () => {
    const reviewService = {
      submitReview: sinon.stub().resolves({ id: 1, reviewText: "Great hotel" }),
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
      submitReview: sinon.stub().rejects(new Error("Failed to submit review")),
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
