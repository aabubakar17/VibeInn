// Dashboard.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { vi } from "vitest";
import Dashboard from "../src/components/Dashboard";
import reviewService from "../src/services/review.service";
import authService from "../src/services/auth.service";
import sentimentService from "../src/services/sentiment.service";
import accommService from "../src/services/accommodation.service";
import userEvent from "@testing-library/user-event";

vi.mock("../src/services/review.service");
vi.mock("../src/services/auth.service");
vi.mock("../src/services/sentiment.service");
vi.mock("../src/services/accommodation.service");
vi.mock("@xenova/transformers", () => ({
  pipeline: vi
    .fn()
    .mockResolvedValue((text) => [{ label: "POSITIVE", score: 0.9 }]),
  env: {
    allowLocalModels: false,
    useBrowserCache: false,
  },
}));

describe("Dashboard Component", () => {
  const mockUser = {
    user: {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },
  };

  const mockReviews = [
    {
      _id: "1",
      text: "<p>Great place!</p>",
      accommodationId: "hotel1",
      sentimentScore: 7,
      publishedDate: "2023-01-01",
    },
  ];

  const mockHotelDetails = {
    hotel1: {
      hotelId: "hotel1",
      title: "Hotel Example",
      location: "Location Example",
      photos: [
        { urlTemplate: "https://example.com/photo1.jpg" },
        { urlTemplate: "https://example.com/photo2.jpg" },
      ],
    },
  };

  beforeEach(() => {
    authService.getCurrentUser.mockReturnValue(mockUser);
    authService.isLoggedIn.mockReturnValue(true);
    reviewService.getReviewsByUserId.mockResolvedValue(mockReviews);
    accommService.getHotelDetails.mockResolvedValue(mockHotelDetails);
    sentimentService.getSentiment.mockResolvedValue([7]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading state initially", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </MantineProvider>
    );

    expect(screen.getByText("No reviews found.")).toBeInTheDocument();
  });

  it("should render user profile information", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      expect(screen.getByText("1 reviews")).toBeInTheDocument();
    });
  });

  it("should render reviews", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Great place!/i)).toBeInTheDocument();
      expect(screen.getByText(/Vibe Score:/i)).toHaveTextContent(
        "Vibe Score: 7"
      );
      expect(screen.getByText(/Posted/i)).toHaveTextContent(
        "Posted 01/01/2023"
      );
    });
  });

  it("should handle delete review action", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Great place!/i)).toHaveTextContent(
        "Great place!"
      );
    });

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/Great place!/i)).not.toHaveTextContent();
    });
  });

  it("should open and submit update review modal", async () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Great place/i)).toHaveTextContent(
        "Great place!"
      );
    });

    const updateButton = screen.getByRole("button", { name: /Update/i });
    userEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText("Update Review")).toBeInTheDocument();
    });

    const textArea = screen.getByPlaceholderText("Update your review");
    userEvent.clear(textArea);
    userEvent.type(textArea, "Updated review text");
    await waitFor(() => {
      expect(textArea).toHaveValue("Updated review text");
    });

    const submitButton = screen.getByRole("button", { name: /Submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(reviewService.updateReview).toHaveBeenCalledWith(
        "Updated review text",
        "1"
      );
    });
    await waitFor(() => {
      expect(screen.getByText(/Updated review text/i)).toHaveTextContent(
        "Updated review text"
      );
    });
  });
});
