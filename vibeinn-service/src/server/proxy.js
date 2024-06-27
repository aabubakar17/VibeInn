import axios from "axios";
import NodeCache from "node-cache";
import { pipeline } from "@xenova/transformers";
import fetch, { Headers } from "node-fetch";

if (typeof global.fetch === "undefined") {
  global.fetch = fetch;
  if (typeof global.Headers === "undefined") {
    global.Headers = Headers;
  }
}

export default class Proxy {
  cache = new NodeCache({ stdTTL: 86400 });
  pipe = null;

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

  getHotelReviews = async (hotelID, checkIn, checkOut) => {
    const cacheKey = `${hotelID}-${checkIn}-${checkOut}`;
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const reviewResponse = await axios.get(
        "https://tripadvisor16.p.rapidapi.com/api/v1/hotels/getHotelDetails",
        {
          params: {
            id: hotelID,
            checkIn: checkIn,
            checkOut: checkOut,
          },
          headers: {
            "x-rapidapi-key": process.env.TRIPADVISOR_API_KEY,
            "x-rapidapi-host": "tripadvisor16.p.rapidapi.com",
          },
        }
      );

      this.cache.set(cacheKey, reviewResponse.data);
      return reviewResponse.data;
    } catch (error) {
      throw new Error("Failed to fetch hotel reviews");
    }
  };

  getSentiment = async (reviewText) => {
    reviewText = reviewText.replace(/<[^>]*>?/gm, "");
    try {
      const cachedResult = this.cache.get(reviewText);
      if (cachedResult) {
        return cachedResult;
      }

      if (!this.pipe) {
        this.pipe = await pipeline(
          "sentiment-analysis",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        );
      }

      const sentimentScore = await this.pipe(reviewText);

      const { label, score } = sentimentScore[0];

      let mappedScore = 5;
      if (label === "NEGATIVE") {
        mappedScore = 1 + (1 - score) * 4;
      } else if (label === "POSITIVE") {
        mappedScore = 6 + score * 4;
      }

      mappedScore = Math.round(mappedScore);

      this.cache.set(reviewText, mappedScore);

      return mappedScore;
    } catch (error) {
      return error;
    }
  };
}
