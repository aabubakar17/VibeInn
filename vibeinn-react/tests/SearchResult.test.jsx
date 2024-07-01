import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, it, vi } from "vitest";
import accommService from "../src/services/accommodation.service";
import SearchResults from "../src/components/SearchResults";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import MapContainer from "../src/components/MapContainer";
import APIProviderWrapper from "../src/components/APIProviderWrapper";

vi.mock("../src/services/accommodation.service");
vi.mock("../src/components/MapContainer", () => ({
  __esModule: true,
  default: vi.fn(),
}));
vi.mock("../src/components/APIProviderWrapper", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

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
            count: 4,
            rating: 3.5,
          },
          priceForDisplay: "$100",
          cardPhotos: [
            { sizes: { urlTemplate: "https://example.com/photo1.jpg" } },
            { sizes: { urlTemplate: "https://example.com/photo2.jpg" } },
          ],
          secondaryInfo: "Central location",
        },
        {
          id: 2,
          title: "Eiffel Tower Hotel",
          bubbleRating: {
            count: 8,
            rating: 4.5,
          },
          priceForDisplay: "$150",
          cardPhotos: [
            { sizes: { urlTemplate: "https://example.com/photo3.jpg" } },
            { sizes: { urlTemplate: "https://example.com/photo4.jpg" } },
          ],
          secondaryInfo: "Near Eiffel Tower",
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
      expect(screen.getByText("Eiffel Tower Hotel")).toBeInTheDocument();
      expect(screen.getByText("Search Results for Paris")).toBeInTheDocument();
      expect(screen.getByText("£100")).toBeInTheDocument();
      expect(screen.getByText("£150")).toBeInTheDocument();
      expect(screen.getByText("3.5 (4 reviews)")).toBeInTheDocument();
      expect(screen.getByText("4.5 (8 reviews)")).toBeInTheDocument();
    });
  });

  it("should open the modal with hotel details when a marker is clicked", async () => {
    const marker = {
      id: 1,
      cardPhotos: [
        { sizes: { urlTemplate: "https://example.com/photo1.jpg" } },
      ],
    };
    MapContainer.mockImplementation(({ onMarkerClick }) => (
      <div onClick={() => onMarkerClick(marker)}>Mocked Map</div>
    ));

    const map = await screen.findByText("Mocked Map");
    userEvent.click(map);

    await waitFor(() => {
      expect(screen.getByText("Paris Hotel")).toBeInTheDocument();
    });
  });
});
