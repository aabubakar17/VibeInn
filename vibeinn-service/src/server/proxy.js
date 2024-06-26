import axios from "axios";
import NodeCache from "node-cache";

export default class Proxy {
  cache = new NodeCache({ stdTTL: 86400 });
  searchLocation = async (location) => {
    const cachedResponse = this.cache.get(location);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const response = await axios.get(
        "https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation",
        {
          params: { query: location },
          headers: {
            "x-rapidapi-key": process.env.TRIPADVISOR_API_KEY,
            "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
          },
        }
      );

      this.cache.set(location, response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch location data");
    }
  };

  searchHotels = async (location, checkIn, checkOut) => {
    let geoID = this.cache.get(`${location}-geoID`);

    if (!geoID) {
      const locationResponse = await this.searchLocation(location);
      console.log(locationResponse.data);
      geoID = locationResponse?.data[0]?.geoId;

      if (!geoID) {
        throw new Error("Location not found");
      }

      this.cache.set(`${location}-geoID`, geoID);
    }

    const cacheKey = `${geoID}-${checkIn}-${checkOut}`;
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const hotelResponse = await axios.get(
        "https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels",
        {
          params: {
            geoId: geoID,
            checkIn: checkIn,
            checkOut: checkOut,
            pageNumber: "1",
          },
          headers: {
            "x-rapidapi-key": process.env.TRIPADVISOR_API_KEY,
            "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
          },
        }
      );

      this.cache.set(cacheKey, hotelResponse.data);
      return hotelResponse.data;
    } catch (error) {
      throw new Error("Failed to fetch hotel data");
    }
  };
}
