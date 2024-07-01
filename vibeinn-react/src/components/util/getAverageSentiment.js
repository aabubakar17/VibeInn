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
          return { content: [] };
        }
      })
    );

    // Filter out any empty arrays from the reviews
    const filteredReviews = reviews.filter(
      (hotelReviews) => hotelReviews.content.length > 0
    );

    console.log(filteredReviews);
    // Extract review texts from the filtered reviews
    const allReviewTexts = filteredReviews.map((hotelReviews) =>
      hotelReviews.content.map((review) => review.text)
    );

    /* console.log(allReviewTexts[0]); */

    // Get sentiments for the extracted reviews

    const sentiments = await Promise.all(
      allReviewTexts.map(async (hotelReviews) => {
        try {
          const result = await sentimentService.getSentiment(hotelReviews);
          return result;
        } catch (error) {
          console.error("Error getting sentiment:", error);
          return null;
        }
      })
    );

    /*     console.log(typeof sentiments[0].sentimentScore[0]); */

    // Calculate average sentiment for each hotel
    const averageSentiments = sentiments.map((hotelSentiments) => {
      if (hotelSentiments && hotelSentiments.sentimentScore.length > 0) {
        const sum = hotelSentiments.sentimentScore.reduce((a, b) => a + b, 0);
        const average = sum / hotelSentiments.sentimentScore.length;
        return Math.round(average);
      } else {
        return null;
      }
    });

    console.log(averageSentiments);

    return averageSentiments;
  } catch (error) {
    console.error("Error getting average sentiment:", error);
    throw error;
  }
}
