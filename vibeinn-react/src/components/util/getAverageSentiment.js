/* import accommService from "../../services/accommodation.service";
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
          return [];
        }
      })
    );

    // Flatten the array of reviews arrays into a single array

    const allReviews = reviews.map((hotelReviews) =>
      hotelReviews.content.map((review) => review.text).flat()
    );

    console.log(allReviews[0]);

    
    // Get sentiments for the extracted reviews
     const sentiments = allReviews.map(async (reviewsForSentiment) =>{
    
      try {
        const result = await sentimentService.getSentiment(reviewsForSentiment);
        return result;
      } catch (error) {
        console.error("Error getting sentiment:", error);
        return [];
      
      }
    })

     return sentiments;
  } catch (error) {
    console.error("Error getting average sentiment:", error);
    throw error;
  }
} */
