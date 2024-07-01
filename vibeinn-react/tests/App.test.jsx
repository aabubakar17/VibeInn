import App from "../src/App";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import accommService from "../src/services/accommodation.service";
import { MantineProvider } from "@mantine/core";

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

describe("App", () => {
  it("should render the App", () => {
    render(
      <MantineProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    );

    expect(screen.getByText("VibeInn")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Get Started ➔")).toBeInTheDocument();
    expect(
      screen.getByText("Discover the Vibe of Your Next Stay")
    ).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("What Our Users Say")).toBeInTheDocument();
    expect(screen.getByText("Join VibeInn Today")).toBeInTheDocument();
  });
});
