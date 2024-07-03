import { vi, mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import Hero from "../src/components/Hero";

describe("Hero component tests", () => {
  const initialLocation = "Paris";
  const initialStartDate = new Date("2024-07-01");
  const initialEndDate = new Date("2024-07-07");

  // Mock useNavigate function
  vi.mock("react-router-dom", async () => {
    const mod = await vi.importActual("react-router-dom");
    return {
      ...mod,
      useNavigate: () => vi.fn(),
      BrowserRouter: ({ children }) => <div>{children}</div>,
    };
  });

  test("renders component with initial values", () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Hero
            initialLocation={initialLocation}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />
        </MantineProvider>
      </BrowserRouter>
    );

    // Check initial location value
    const locationInput = screen.getByPlaceholderText("Search destination");
    expect(locationInput).toBeInTheDocument();
    expect(locationInput).toHaveValue(initialLocation);

    // Check initial date values
    const checkInOutInput = screen.getByPlaceholderText("Check-in ~ Check-out");
    expect(checkInOutInput).toBeInTheDocument();
    expect(checkInOutInput).toHaveValue("Jul-01 ~ Jul-07"); // Assuming date format MMM-DD

    // Check discover button
    const discoverButton = screen.getByText("Discover ➔");
    expect(discoverButton).toBeInTheDocument();
  });

  test("updates location input", async () => {
    render(
      <BrowserRouter>
        <MantineProvider>
          <Hero
            initialLocation={initialLocation}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />
        </MantineProvider>
      </BrowserRouter>
    );

    const locationInput = screen.getByPlaceholderText("Search destination");
    userEvent.clear(locationInput);
    userEvent.type(locationInput, "New York");
    await waitFor(() => {
      expect(locationInput).toHaveValue("New York");
    });
  });
});
