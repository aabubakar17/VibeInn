import axios from "axios";

const API_URL_SENTIMENT = import.meta.env.VITE_REACT_APP_API_URL_ACCOMM;

const getSentiment = async (text) => {
  try {
    const response = await axios.post(`${API_URL_SENTIMENT}/sentiment`, {
      reviewText: text,
    });

    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

const sentimentService = {
  getSentiment,
};

export default sentimentService;
