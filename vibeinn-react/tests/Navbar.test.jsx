import Navbar from "../src/components/Navbar";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, vi } from "vitest";
import { BrowserRouter, useNavigate } from "react-router-dom";

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should render without crashing", () => {
    vi.mock("react-router-dom", () => ({
      Link: () => <div />,
      BrowserRouter: ({ children }) => <div>{children}</div>,
      useNavigate: () => vi.fn(),
    }));

    render(
      <BrowserRouter>
        <Navbar loggedIn={true} setLoggedIn={vi.fn()} />
      </BrowserRouter>
    );
  });

  it("should render the correct links when not logged in", () => {
    vi.mock("react-router-dom", () => ({
      Link: ({ to, children }) => <a href={to}>{children}</a>,
      BrowserRouter: ({ children }) => <div>{children}</div>,
      useNavigate: () => vi.fn(),
    }));

    render(
      <BrowserRouter>
        <Navbar loggedIn={false} setLoggedIn={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText("Login").getAttribute("href")).toEqual("/login");
  });

  it("should render the correct links when logged in", () => {
    vi.mock("react-router-dom", () => ({
      Link: ({ to, children }) => <a href={to}>{children}</a>,
      BrowserRouter: ({ children }) => <div>{children}</div>,
      useNavigate: () => vi.fn(),
    }));

    render(
      <BrowserRouter>
        <Navbar loggedIn={true} setLoggedIn={vi.fn()} />
      </BrowserRouter>
    );
    expect(screen.getByText("Dashboard").getAttribute("href")).toEqual(
      "/dashboard"
    );
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("should call setLoggedIn when logout is clicked", () => {
    const setLoggedIn = vi.fn();
    vi.mock("react-router-dom", () => ({
      Link: ({ to, children }) => <a href={to}>{children}</a>,
      BrowserRouter: ({ children }) => <div>{children}</div>,
      useNavigate: () => vi.fn(),
    }));

    render(
      <BrowserRouter>
        <Navbar loggedIn={true} setLoggedIn={setLoggedIn} />
      </BrowserRouter>
    );
    userEvent.click(screen.getByText("Logout"));
    expect(setLoggedIn).toHaveBeenCalledWith(false);
  });

  it("should call setLoggedIn when login is clicked", () => {
    const setLoggedIn = vi.fn();
    vi.mock("react-router-dom", () => ({
      Link: ({ to, children }) => <a href={to}>{children}</a>,
      BrowserRouter: ({ children }) => <div>{children}</div>,
      useNavigate: () => vi.fn(),
    }));

    render(
      <BrowserRouter>
        <Navbar loggedIn={false} setLoggedIn={setLoggedIn} />
      </BrowserRouter>
    );
    userEvent.click(screen.getByText("Login"));
    expect(setLoggedIn).toHaveBeenCalled();
  });
});
