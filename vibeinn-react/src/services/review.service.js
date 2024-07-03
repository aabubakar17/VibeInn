import axios from "axios";

const API_URL_REVIEW = import.meta.env.VITE_REACT_APP_API_URL_ACCOMM;
const submitReview = async (reviewText, hotelId) => {
  console.log(reviewText, hotelId);
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming the token is stored in localStorage
    console.log(user.token);
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

const getReviewsByUserId = async (userId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming the token is stored in localStorage
    const response = await axios.get(
      `${API_URL_REVIEW}/review/user/${userId}`,
      {
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting reviews by user ID:", error);
    throw error;
  }
};

const deleteReview = async (reviewId) => {
  console.log(reviewId);
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming the token is stored in localStorage
    console.log(user);
    const response = await axios.delete(`${API_URL_REVIEW}/review/delete`, {
      headers: {
        "x-access-token": user.token,
      },
      data: {
        reviewId: reviewId,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

const updateReview = async (reviewText, reviewId) => {
  try {
    const user = JSON.parse(localStorage.getItem("user")); // Assuming the token is stored in localStorage
    const response = await axios.put(
      `${API_URL_REVIEW}/review/update`,
      {
        reviewText: reviewText,
        reviewId: reviewId,
      },
      {
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

const reviewService = {
  submitReview,
  getReviewsByUserId,
  deleteReview,
  updateReview,
};

export default reviewService;
