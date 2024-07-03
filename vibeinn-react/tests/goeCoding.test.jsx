import { it } from "vitest";
import { geocodeHotel } from "../src/services/geoCoding";
import axios from "axios";

vi.mock("axios");

describe("geoCoding", () => {
  it("should return null when no results found for given hotel name", async () => {
    // Arrange
    const hotelName = "Paris Hotel";
    const response = {
      data: {
        results: [],
      },
    };

    axios.get.mockResolvedValue(response);

    // Act
    const result = await geocodeHotel(hotelName);

    // Assert
    expect(result).toBeNull();
  });
  it("should return latitude and longitude for given hotel name", async () => {
    // Arrange
    const hotelName = "Paris Hotel";
    const response = {
      data: {
        results: [
          {
            geometry: {
              location: {
                lat: 48.8566,
                lng: 2.3522,
              },
            },
          },
        ],
      },
    };

    axios.get.mockResolvedValue(response);

    // Act
    const result = await geocodeHotel(hotelName);

    // Assert
    expect(result).toEqual({ latitude: 48.8566, longitude: 2.3522 });
  });
  it("should return null when error occurs during geocoding", async () => {
    // Arrange
    const hotelName = "Paris Hotel";

    axios.get.mockRejectedValue(new Error("Error"));

    // Act
    const result = await geocodeHotel(hotelName);

    // Assert
    expect(result).toBeNull();
  });
});
