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

    console.log(response.data.data);
    if (response.data.data) {
      return {
        title: response.data.data.title,
        location: response.data.data.location.address,
        reviews: response.data.data.reviews,
        about: response.data.data.about,
        tags: response.data.data.tags,
        photos: response.data.data.photos,
        rating: response.data.data.rating,
        numberReviews: response.data.data.numberReviews,
        amenities: response.data.data.amenitiesScreen,
        hotelId: id,
      };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};
const accommService = {
  getHotels,
  getHotelDetails,
};

export default accommService;
