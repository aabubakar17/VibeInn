import axios from "axios";

const API_URL_REVIEW = import.meta.env.VITE_REACT_APP_API_URL_ACCOMM;
const submitReview = async (reviewText, hotelId) => {
  console.log(reviewText, hotelId);
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming the token is stored in localStorage
    console.log(user);
    const response = await axios.post(
      `${API_URL_REVIEW}/review/submit`,
      {
        reviewText: reviewText,
        accommodationId: hotelId,
      },
      {
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

const reviewService = {
  submitReview,
};

export default reviewService;
