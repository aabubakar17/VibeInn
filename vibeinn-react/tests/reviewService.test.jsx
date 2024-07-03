import reviewService from "../src/services/review.service";
import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("axios");
vi.mock("@xenova/transformers", () => ({
  pipeline: vi
    .fn()
    .mockResolvedValue((text) => [{ label: "POSITIVE", score: 0.9 }]),
  env: {
    allowLocalModels: false,
    useBrowserCache: false,
  },
}));

const mockUser = {
  token: "fake-jwt-token",
};

describe("reviewService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("user", JSON.stringify(mockUser));
  });

  it("should fetch reviews for given hotel id", async () => {
    // Arrange
    const userId = "1";
    const response = {
      data: [
        {
          _id: "1",
          text: "Great place!",
          accommodationId: "hotel1",
          sentimentScore: 7,
          publishedDate: "2023-01-01",
        },
      ],
    };

    axios.get.mockResolvedValue(response);

    // Act
    const result = await reviewService.getReviewsByUserId(userId);

    // Assert
    expect(result).toEqual(response.data);
  });

  it("should throw an error when request returns error", async () => {
    // Arrange
    const userId = "1";

    axios.get.mockRejectedValue(new Error("Error"));

    // Act and Assert
    await expect(() =>
      reviewService.getReviewsByUserId(userId)
    ).rejects.toThrow("Error");
  });

  it("should delete review for given review id", async () => {
    // Arrange
    const reviewId = "1";
    const response = {
      data: {
        message: "Review deleted successfully",
      },
    };

    axios.delete.mockResolvedValue(response);

    // Act
    const result = await reviewService.deleteReview(reviewId);

    // Assert
    expect(result).toEqual(response.data);
  });

  it("should throw an error when request returns error", async () => {
    // Arrange
    const reviewId = "1";

    axios.delete.mockRejectedValue(new Error("Error"));

    // Act and Assert
    await expect(() => reviewService.deleteReview(reviewId)).rejects.toThrow(
      "Error"
    );
  });

  it("should update review for given review text and review id", async () => {
    // Arrange
    const reviewText = "Great place!";
    const reviewId = "1";
    const response = {
      data: {
        message: "Review updated successfully",
      },
    };

    axios.put.mockResolvedValue(response);

    // Act
    const result = await reviewService.updateReview(reviewText, reviewId);

    // Assert
    expect(result).toEqual(response.data);
  });

  it("should throw an error when request returns error", async () => {
    // Arrange
    const reviewText = "Great place!";
    const reviewId = "1";

    axios.put.mockRejectedValue(new Error("Error"));

    // Act and Assert
    await expect(() =>
      reviewService.updateReview(reviewText, reviewId)
    ).rejects.toThrow("Error");
  });

  it("should submit review for given review text and accommodation id", async () => {
    // Arrange
    const reviewText = "Great place!";
    const accommodationId = "hotel1";
    const response = {
      data: {
        message: "Review submitted successfully",
      },
    };

    axios.post.mockResolvedValue(response);

    // Act
    const result = await reviewService.submitReview(
      reviewText,
      accommodationId
    );

    // Assert
    expect(result).toEqual(response.data);
  });
  it("should throw an error when request returns error", async () => {
    // Arrange
    const reviewText = "Great place!";
    const accommodationId = "hotel1";

    axios.post.mockRejectedValue(new Error("Error"));

    // Act and Assert
    await expect(() =>
      reviewService.submitReview(reviewText, accommodationId)
    ).rejects.toThrow("Error");
  });
});
