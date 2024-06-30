import axios from "axios";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_API_KEY;

export async function geocodeHotel(hotelName) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: hotelName,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error geocoding hotel:", error.message);
    return null;
  }
}
