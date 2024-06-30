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

const accommService = {
  getHotels,
};

export default accommService;
