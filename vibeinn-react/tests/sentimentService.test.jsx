import { describe, it, expect, vi, beforeEach } from "vitest";
import sentimentService from "../src/services/sentiment.service";

// Mock the @xenova/transformers package
vi.mock("@xenova/transformers", () => ({
  pipeline: vi.fn().mockResolvedValue((text) => {
    // Simulate different sentiment responses based on the review text
    if (text.toLowerCase().includes("negative")) {
      return [{ label: "NEGATIVE", score: 0.1 }];
    } else {
      return [{ label: "POSITIVE", score: 0.9 }];
    }
  }),
  env: {
    allowLocalModels: false,
    useBrowserCache: false,
  },
}));

describe("Sentiment Service", () => {
  beforeEach(() => {
    sentimentService.pipe = null;
    sentimentService.cache.clear();
  });

  it("should clean review text", () => {
    const reviewText = "<p>This is a test review</p>";
    const cleanedText = sentimentService.cleanReviewText(reviewText);
    expect(cleanedText).toEqual("This is a test review");
  });

  it("should handle empty review text", () => {
    const reviewText = "";
    const cleanedText = sentimentService.cleanReviewText(reviewText);
    expect(cleanedText).toEqual("");
  });

  it("should process review text and return sentiment score", async () => {
    const reviewText = "This is a test review";
    const score = await sentimentService.processReview(reviewText);
    expect(score).toBeGreaterThan(5);
  });

  it("should get sentiment for multiple reviews", async () => {
    const reviewTexts = ["This is a test review", "Another review"];
    const scores = await sentimentService.getSentiment(reviewTexts);
    expect(scores.length).toBe(2);
    expect(scores[0]).toBeGreaterThan(5);
    expect(scores[1]).toBeGreaterThan(5);
  });

  it("should process negative review text", async () => {
    const reviewText = "This is a negative review.";
    const score = await sentimentService.processReview(reviewText);
    expect(score).toBeLessThan(6);
  });

  it("should handle errors during review processing", async () => {
    // Mock pipeline to throw an error
    sentimentService.pipe = vi
      .fn()
      .mockRejectedValue(new Error("Pipeline error"));

    const reviewText = "This is a review.";
    try {
      await sentimentService.processReview(reviewText);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual("Pipeline error");
    }
  });
});
