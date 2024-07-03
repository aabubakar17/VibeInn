import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import MapContainer from "../src/components/MapContainer";
import { geocodeHotel } from "../src/services/geoCoding";
import APIProviderWrapper from "../src/components/APIProviderWrapper";
import UserEvent from "@testing-library/user-event";

vi.mock("../src/services/geoCoding");

describe("MapContainer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    render(
      <APIProviderWrapper>
        <MapContainer hotels={[]} />
      </APIProviderWrapper>
    );
  });

  it("should call geocodeHotel for each hotel", async () => {
    const hotels = [{ title: "Hotel 1" }, { title: "Hotel 2" }];
    geocodeHotel.mockResolvedValue({ latitude: 0, longitude: 0 });

    render(
      <APIProviderWrapper>
        <MapContainer hotels={hotels} />
      </APIProviderWrapper>
    );

    await waitFor(() => {
      expect(geocodeHotel).toHaveBeenCalledTimes(hotels.length);
    });
  });

  /* it("should render the correct number of markers", async () => {
    const hotels = [{ title: "Hotel 1" }, { title: "Hotel 2" }];
    geocodeHotel.mockResolvedValue({ latitude: 0, longitude: 0 });

    const { getByTestId } = render(
      <APIProviderWrapper>
        <MapContainer hotels={hotels} />
      </APIProviderWrapper>
    );

    await waitFor(() => {
      expect(getByTestId("hotel-marker").length).toBe(hotels.length);
    });
  });

  it("should call onMarkerClick when a marker is clicked", async () => {
    const hotels = [{ title: "Hotel 1" }];
    const onMarkerClick = vi.fn();
    geocodeHotel.mockResolvedValue({ latitude: 0, longitude: 0 });

    const { getByTestId } = render(
      <APIProviderWrapper>
        <MapContainer hotels={hotels} onMarkerClick={onMarkerClick} />
      </APIProviderWrapper>
    );

    UserEvent.click(getByTestId("hotel-marker"));

    await waitFor(() => {
      expect(onMarkerClick).toHaveBeenCalledTimes(1);
    });
  }); */
});
