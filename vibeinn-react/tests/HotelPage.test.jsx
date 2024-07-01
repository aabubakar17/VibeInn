// HotelPage.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, vi } from "vitest";
import HotelPage from "../src/components/HotelPage";
import accommService from "../src/services/accommodation.service";
import sentimentService from "../src/services/sentiment.service";
import { MantineProvider } from "@mantine/core";

// Mock useParams to return a test ID

// Mock accommService
vi.mock("../src/services/accommodation.service");

// Mock sentimentService
vi.mock("../src/services/sentiment.service");
vi.mock("@xenova/transformers", () => ({
  pipeline: vi
    .fn()
    .mockResolvedValue((text) => [{ label: "POSITIVE", score: 0.9 }]),
  env: {
    allowLocalModels: false,
    useBrowserCache: false,
  },
}));

describe("HotelPage Component", () => {
  const mockHotelDetails = {
    title: "Test Hotel",
    rating: 4.5,
    numberReviews: 10,
    photos: [
      { urlTemplate: "https://example.com/photo1.jpg" },
      { urlTemplate: "https://example.com/photo2.jpg" },
    ],
    about: {
      tags: ["Tag1", "Tag2"],
    },
    amenities: [
      {
        title: "Amenity1",
        content: ["Feature1", "Feature2"],
      },
    ],
    reviews: {
      content: [
        {
          text: "<p>Great place!</p>",
          userProfile: {
            avatar: {
              urlTemplate: "https://example.com/avatar1.jpg",
            },
          },
          publishedDate: "2023-01-01",
        },
      ],
    },
  };

  const mockSentimentScores = [7];

  beforeEach(() => {
    accommService.getHotelDetails.mockResolvedValue(mockHotelDetails);
    sentimentService.getSentiment.mockResolvedValue(mockSentimentScores);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render hotel details correctly", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <HotelPage />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Hotel")).toBeInTheDocument();
      expect(screen.getByText("4.5 (10 reviews)")).toBeInTheDocument();
      expect(screen.getByText("Great place!")).toBeInTheDocument();
      expect(screen.getByText("Vibe Score: 7")).toBeInTheDocument();
    });
  });

  it("should render amenities correctly", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <HotelPage />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Amenity1")).toBeInTheDocument();
      expect(screen.getByText("Feature1")).toBeInTheDocument();
      expect(screen.getByText("Feature2")).toBeInTheDocument();
    });
  });

  it("should render tags correctly", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <HotelPage />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Tag1")).toBeInTheDocument();
      expect(screen.getByText("Tag2")).toBeInTheDocument();
    });
  });
});
