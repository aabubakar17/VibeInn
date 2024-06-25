import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Login from "../src/components/Login";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";
import AuthService from "../src/services/auth.service";
import { MantineProvider } from "@mantine/core";

// Mock AuthService
vi.mock("../src/services/auth.service");

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }) => children,
    useNavigate: vi.fn(),
  };
});

describe("LoginPage", () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should log in for valid email and password", async () => {
    // Arrange
    AuthService.login = vi.fn().mockResolvedValue({ token: "fake-token" });
    const TestComponent = () => {
      const [loggedIn, setLoggedIn] = useState(false);

      return (
        <Router>
          <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </Router>
      );
    };

    render(<TestComponent />);

    // Act
    const emailInput = await screen.findByPlaceholderText(
      /Enter Email Address/i
    );
    await userEvent.type(emailInput, "Email@123.com");

    const passwordInput = await screen.findByPlaceholderText(/Enter Password/i);
    await userEvent.type(passwordInput, "Test@1234");

    const loginButton = screen.getByRole("button", { name: /Login/i });
    await userEvent.click(loginButton);

    // Assert
    expect(
      screen.queryByText("Please enter a valid email address")
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith(
        "Email@123.com",
        "Test@1234"
      );
    });
  });

  it("should not log in for invalid email", async () => {
    // Arrange
    render(
      <Router>
        <Login />
      </Router>
    );

    // Act
    const emailInput = await screen.findByPlaceholderText(
      /Enter Email Address/i
    );
    await userEvent.type(emailInput, "invalidEmail");

    const passwordInput = await screen.findByPlaceholderText(/Enter Password/i);
    await userEvent.type(passwordInput, "Test@1234");

    const loginButton = screen.getByRole("button", { name: /Login/i });
    await userEvent.click(loginButton);

    // Assert
    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  it("should display an error message on failed login", async () => {
    // Arrange
    AuthService.login = vi.fn().mockRejectedValue(new Error("Login failed"));
    const TestComponent = () => {
      const [loggedIn, setLoggedIn] = useState(false);

      return (
        <MantineProvider>
          <Router>
            <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          </Router>
        </MantineProvider>
      );
    };

    render(<TestComponent />);

    // Act
    const emailInput = await screen.findByPlaceholderText(
      /Enter Email Address/i
    );
    await userEvent.type(emailInput, "Email@123.com");

    const passwordInput = await screen.findByPlaceholderText(/Enter Password/i);
    await userEvent.type(passwordInput, "Test@1234");

    const loginButton = screen.getByRole("button", { name: /Login/i });
    await userEvent.click(loginButton);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("Login failed. Please try again.")
      ).toBeInTheDocument();
    });
  });

  it("should navigate to register page on 'Register' button click", async () => {
    // Arrange
    render(
      <MantineProvider>
        <Router>
          <Login />
        </Router>
      </MantineProvider>
    );

    // Act
    const registerButton = screen.getByRole("button", { name: /Register/i });
    await userEvent.click(registerButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
