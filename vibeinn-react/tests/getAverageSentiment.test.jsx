import { getAverageSentiment } from "../src/components/util/getAverageSentiment";
vi.mock("@xenova/transformers", () => ({
  pipeline: vi
    .fn()
    .mockResolvedValue((text) => [{ label: "POSITIVE", score: 0.9 }]),
  env: {
    allowLocalModels: false,
    useBrowserCache: false,
  },
}));
describe("getAverageSentiment", () => {
  it("should return null when sentiment scores are empty", () => {
    // Arrange
    const sentimentScores = [];

    // Act
    const result = getAverageSentiment(sentimentScores);

    // Assert
    expect(result).toBeNull();
  });

  it("should return average sentiment score when sentiment score is not empty", () => {
    // Arrange
    const sentimentScores = [5, 6, 7];

    // Act
    const result = getAverageSentiment(sentimentScores);

    // Assert
    expect(result).toBe(6);
  });
});
