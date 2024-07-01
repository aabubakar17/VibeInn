import accommService from "../../services/accommodation.service";
import sentimentService from "../../services/sentiment.service";

export default async function getAverageSentiment(hotels, checkIn, checkOut) {
  try {
    // Fetch reviews for each hotel
    const reviews = await Promise.all(
      hotels.map(async (hotel) => {
        try {
          const result = await accommService.getHotelDetails(
            hotel.id,
            checkIn,
            checkOut
          );
          return result.reviews;
        } catch (error) {
          console.error(
            `Error fetching details for hotel ID ${hotel.id}:`,
            error
          );
          return { content: [] }; // Handle empty response gracefully
        }
      })
    );

    // Filter out any empty arrays from the reviews
    const filteredReviews = reviews.filter(
      (hotelReviews) => hotelReviews.content.length > 0
    );

    // Extract review texts from the filtered reviews
    const allReviewTexts = filteredReviews.map((hotelReviews) =>
      hotelReviews.content.map((review) => review.text)
    );

    // Get sentiments for the extracted reviews
    const sentiments = await Promise.all(
      allReviewTexts.map(async (hotelReviews) => {
        try {
          const result = await sentimentService.getSentiment(hotelReviews);
          return result;
        } catch (error) {
          console.error("Error getting sentiment:", error);
          return { sentimentScore: [] }; // Handle empty sentiment response
        }
      })
    );

    // Calculate average sentiment for each hotel
    const averageSentiments = sentiments.map((hotelSentiments) => {
      if (hotelSentiments && hotelSentiments.sentimentScore.length > 0) {
        const sum = hotelSentiments.sentimentScore.reduce((a, b) => a + b, 0);
        const average = sum / hotelSentiments.sentimentScore.length;
        return Math.round(average);
      } else {
        return null; // Handle cases where sentiment score is empty
      }
    });

    return averageSentiments;
  } catch (error) {
    console.error("Error getting average sentiment:", error);
    throw error;
  }
}
