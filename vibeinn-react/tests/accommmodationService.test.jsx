import axios from "axios";
import accommService from "../src/services/accommodation.service";
import { describe, test } from "vitest";

vi.mock("axios");

describe("accommodationService", () => {
  describe("getHotels", () => {
    it("should fetch hotels for given location and dates", async () => {
      // Arrange
      const location = "Paris";
      const checkIn = "2024-07-01";
      const checkOut = "2024-07-05";
      const response = {
        data: {
          data: [
            {
              id: 1,
              title: "Paris Hotel",
              bubbleRating: {
                count: "4",
                rating: 3.5,
              },
              priceForDisplay: "$100",
            },
          ],
        },
      };

      axios.get.mockResolvedValue(response);

      // Act
      const result = await accommService.getHotels(location, checkIn, checkOut);

      // Assert
      expect(result).toEqual(response.data.data);
    });

    it("should throw an error when request return error", async () => {
      // Arrange
      const location = "Paris";
      const checkIn = "2024-07-01";
      const checkOut = "2024-07-05";

      axios.get.mockRejectedValue(new Error("Error"));

      // Act and Assert
      await expect(() =>
        accommService.getHotels(location, checkIn, checkOut)
      ).rejects.toThrow("Error");
    });
  });

  describe("getHotelDetails", () => {
    it("should fetch hotel details for given id and dates", async () => {
      // Arrange
      const id = 1;
      const checkIn = "2024-07-01";
      const checkOut = "2024-07-05";
      const response = {
        data: {
          data: {
            title: "Paris Hotel",
            geoPoint: "48.8566, 2.3522",
            reviews: {
              content: [
                {
                  text: "Great hotel!",
                },
              ],
            },
            about: "A great hotel in Paris",
            tags: ["Paris", "Hotel"],
            photos: ["photo1.jpg", "photo2.jpg"],
            rating: 4.5,
            numberReviews: 100,
            amenitiesScreen: ["Free WiFi", "Breakfast"],
          },
        },
      };

      axios.get.mockResolvedValue(response);

      // Act
      const result = await accommService.getHotelDetails(id, checkIn, checkOut);

      // Assert
      expect(result).toEqual({
        title: "Paris Hotel",
        location: "48.8566, 2.3522",
        reviews: {
          content: [{ text: "Great hotel!" }],
        },
        about: "A great hotel in Paris",
        tags: ["Paris", "Hotel"],
        photos: ["photo1.jpg", "photo2.jpg"],
        rating: 4.5,
        numberReviews: 100,
        amenities: ["Free WiFi", "Breakfast"],
      });
    });
  });
});
