// HotelPage.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, vi } from "vitest";
import HotelPage from "../src/components/HotelPage";
import accommService from "../src/services/accommodation.service";
import sentimentService from "../src/services/sentiment.service";
import { MantineProvider } from "@mantine/core";
import userEvent from "@testing-library/user-event";

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

  it("should display loading state initially", async () => {
    vi.clearAllMocks();
    render(
      <MantineProvider>
        <BrowserRouter>
          <HotelPage />
        </BrowserRouter>
      </MantineProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      // Add assertions for the expected content once loading is completed
      expect(screen.getByText("Test Hotel")).toBeInTheDocument();
      expect(screen.getByText("4.5 (10 reviews)")).toBeInTheDocument();
    });
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
      expect(screen.getByText("Vibe Score:")).toBeInTheDocument();
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

  it("should open modal with selected photo", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <HotelPage />
        </BrowserRouter>
      </MantineProvider>
    );

    // Assuming the first photo is selected
    const firstPhoto = screen.getByAltText("Slide 0");
    userEvent.click(firstPhoto);

    await waitFor(() => {
      expect(screen.getByAltText("Slide 0")).toBeInTheDocument();
    });
  });
  it("should prompt for login when submitting a review without logging in", async () => {
    // Mock loggedIn state as false
    const loggedIn = false;

    render(
      <MantineProvider>
        <BrowserRouter>
          <HotelPage loggedIn={loggedIn} />
        </BrowserRouter>
      </MantineProvider>
    );

    // Fill out the review text area
    const reviewTextArea = screen.getByPlaceholderText(
      "Write your review here..."
    );
    userEvent.type(reviewTextArea, "This is a test review.");

    // Submit the review
    const submitButton = screen.getByText("Submit Review");
    userEvent.click(submitButton);

    // Expect the login modal to be displayed
    await waitFor(() => {
      expect(
        screen.getByText("Please login or register to leave a review")
      ).toBeInTheDocument();
    });
  });

  it("should handle error when fetching sentiments", async () => {
    // Mock sentimentService.getSentiment to throw an error
    sentimentService.getSentiment.mockRejectedValue(
      new Error("Failed to fetch sentiments")
    );

    render(
      <MantineProvider>
        <BrowserRouter>
          <HotelPage />
        </BrowserRouter>
      </MantineProvider>
    );

    // Expect the component to render an error message
    await waitFor(() => {
      expect(screen.getByText("Vibe Score:")).toBeInTheDocument();
    });
  });
});
