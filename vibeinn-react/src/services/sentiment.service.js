import { pipeline } from "@xenova/transformers";
import { env } from "@xenova/transformers";

env.allowLocalModels = false;
env.useBrowserCache = false;

class SentimentService {
  constructor() {
    this.pipe = null;
    this.cache = new Map();
    this.sentimentScores = [];
  }

  cleanReviewText(reviewText) {
    return reviewText.replace(/<[^>]*>?/gm, "");
  }

  async processReview(reviewText) {
    try {
      if (this.cache.has(reviewText)) {
        return this.cache.get(reviewText);
      }

      if (!this.pipe) {
        this.pipe = await pipeline(
          "sentiment-analysis",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        );
      }

      const sentimentScore = await this.pipe(reviewText);

      const { label, score } = sentimentScore[0];

      let mappedScore = 5;
      if (label === "NEGATIVE") {
        mappedScore = 1 + (1 - score) * 4;
      } else if (label === "POSITIVE") {
        mappedScore = 6 + score * 4;
      }

      mappedScore = Math.round(mappedScore);

      return mappedScore;
    } catch (error) {
      console.error("Error processing review:", error);

      return error.message;
    }
  }

  async getSentiment(reviewTexts) {
    try {
      if (!Array.isArray(reviewTexts)) {
        reviewTexts = [reviewTexts];
      }

      const results = [];
      for (const reviewText of reviewTexts) {
        const result = await this.processReview(
          this.cleanReviewText(reviewText)
        );
        results.push(result);
      }

      return results;
    } catch (error) {
      console.error("Error getting sentiment:", error);
      return error.message;
    }
  }
}
const sentimentService = new SentimentService();
export default sentimentService;
