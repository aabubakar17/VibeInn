import accommService from "../../services/accommodation.service";
import sentimentService from "../../services/sentiment.service";

export function getAverageSentiment(sentimentScores) {
  if (sentimentScores && sentimentScores.length > 0) {
    const sum = sentimentScores.reduce((a, b) => a + b, 0);
    const average = sum / sentimentScores.length;
    return Math.round(average);
  } else {
    return null; // Handle case where sentiment scores are empty
  }
}
