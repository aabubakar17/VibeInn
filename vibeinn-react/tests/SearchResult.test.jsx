import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, it, vi } from "vitest";
import accommService from "../src/services/accommodation.service";
import SearchResults from "../src/components/SearchResults";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";

vi.mock("../src/services/accommodation.service");

const renderSearchResults = (
  initialEntries = [
    "/search?location=Paris&checkIn=2024-07-01&checkOut=2024-07-05&page=1",
  ]
) => {
  render(
    <MantineProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <SearchResults />
      </MemoryRouter>
    </MantineProvider>
  );
};

describe("SearchResults Component", () => {
  beforeEach(() => {
    accommService.getHotels.mockResolvedValue({
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
    });
    renderSearchResults();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render title with search location", async () => {
    await waitFor(() => {
      expect(screen.getByText("Search Results for Paris")).toBeInTheDocument();
    });
  });

  it("should fetch hotels on mount", async () => {
    await screen.findByText("Paris Hotel");

    expect(accommService.getHotels).toHaveBeenCalledWith(
      "Paris",
      "2024-07-01",
      "2024-07-05"
    );
  });

  it("should display search modal when 'open search' button is clicked", async () => {
    userEvent.click(screen.getByText("open search"));

    expect(
      screen.getByText(/Find your place to vibe in Paris/i)
    ).toBeInTheDocument();
  });

  it("should display search results for Paris", async () => {
    await screen.findByText("Paris Hotel");

    await waitFor(() => {
      expect(screen.getByText("Paris Hotel")).toBeInTheDocument();
      expect(screen.getByText("Search Results for Paris")).toBeInTheDocument();
      expect(screen.getByText("£100")).toBeInTheDocument();
      expect(screen.getByText("3.5 (4 reviews)")).toBeInTheDocument();
    });
  });
});
