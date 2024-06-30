import axios from "axios";

const API_URL_ACCOMM = import.meta.env.VITE_REACT_APP_API_URL_ACCOMM;

const getHotels = async (location, checkIn, checkOut) => {
  try {
    const response = await axios.get(
      `${API_URL_ACCOMM}/hotels?location=${location}&checkIn=${checkIn}&checkOut=${checkOut}`
    );

    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

const getHotelDetails = async (id, checkIn, checkOut) => {
  try {
    const response = await axios.get(
      `${API_URL_ACCOMM}/hotel/${id}?checkIn=${checkIn}&checkOut=${checkOut}`
    );

    return {
      title: response.data.data.title,
      location: response.data.data.geoPoint,
      reviews: response.data.data.reviews,
      about: response.data.data.about,
      tags: response.data.data.tags,
      photos: response.data.data.photos,
      rating: response.data.data.rating,
      numberReviews: response.data.data.numberReviews,
    };
  } catch (error) {
    throw new Error(error);
  }
};
const accommService = {
  getHotels,
  getHotelDetails,
};

export default accommService;
