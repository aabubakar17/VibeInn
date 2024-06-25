import { render, screen, waitFor } from "@testing-library/react";
import Register from "../src/components/Register";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { vi } from "vitest";
import AuthService from "../src/services/auth.service";
import { MantineProvider } from "@mantine/core";

// Mock AuthService
vi.mock("../src/services/auth.service");

describe("RegistrationPage", () => {
  it("should register for valid email and password", async () => {
    // Arrange
    AuthService.register = vi.fn().mockResolvedValue({ token: "fake-token" });
    render(
      <Router>
        <MantineProvider>
          <Register />
        </MantineProvider>
      </Router>
    );

    // Act
    const firstNameInput = await screen.findByPlaceholderText(
      /Enter your first name/i
    );
    await userEvent.type(firstNameInput, "John");

    const lastNameInput = await screen.findByPlaceholderText(
      /Enter your last name/i
    );
    await userEvent.type(lastNameInput, "Doe");

    const emailInput = await screen.findByPlaceholderText(/Enter your Email/i);
    await userEvent.type(emailInput, "Email@123.com");

    const passwordInput = await screen.findByPlaceholderText(
      /Enter your Password/i
    );
    await userEvent.type(passwordInput, "Test@1234");

    const registerButton = screen.getByRole("button", { name: /Register/i });
    await userEvent.click(registerButton);

    // Assert
    expect(
      screen.queryByText("Please enter a valid email address")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Password must be at least 8 characters, including at least 1 uppercase character, a number, and a special character"
      )
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith(
        "John",
        "Doe",
        "Email@123.com",
        "Test@1234"
      );
    });
  });

  it("should not register for invalid email", async () => {
    // Arrange
    render(
      <Router>
        <MantineProvider>
          <Register />
        </MantineProvider>
      </Router>
    );

    // Act
    const firstNameInput = await screen.findByPlaceholderText(
      /Enter your first name/i
    );
    await userEvent.type(firstNameInput, "John");

    const lastNameInput = await screen.findByPlaceholderText(
      /Enter your last name/i
    );
    await userEvent.type(lastNameInput, "Doe");

    const emailInput = await screen.findByPlaceholderText(/Enter your Email/i);
    await userEvent.type(emailInput, "invalidEmail");

    const passwordInput = await screen.findByPlaceholderText(
      /Enter your Password/i
    );
    await userEvent.type(passwordInput, "Test@1234");

    const registerButton = screen.getByRole("button", { name: /Register/i });
    await userEvent.click(registerButton);

    // Assert
    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  it("should render error for invalid password", async () => {
    // Arrange
    render(
      <Router>
        <MantineProvider>
          <Register />
        </MantineProvider>
      </Router>
    );

    // Act
    const firstNameInput = await screen.findByPlaceholderText(
      /Enter your first name/i
    );
    await userEvent.type(firstNameInput, "John");

    const lastNameInput = await screen.findByPlaceholderText(
      /Enter your last name/i
    );
    await userEvent.type(lastNameInput, "Doe");

    const emailInput = await screen.findByPlaceholderText(/Enter your Email/i);
    await userEvent.type(emailInput, "Email@123.com");

    const passwordInput = await screen.findByPlaceholderText(
      /Enter your Password/i
    );
    await userEvent.type(passwordInput, "InvalidPassword");

    const registerButton = screen.getByRole("button", { name: /Register/i });
    await userEvent.click(registerButton);

    // Assert
    expect(
      screen.getByText(
        "Password must be at least 8 characters, including at least 1 uppercase character, a number, and a special character"
      )
    ).toBeInTheDocument();
  });

  it("should display an error message on failed registration", async () => {
    // Arrange
    AuthService.register = vi
      .fn()
      .mockRejectedValue(new Error("Registration failed"));
    render(
      <Router>
        <MantineProvider>
          <Register />
        </MantineProvider>
      </Router>
    );

    // Act
    const firstNameInput = await screen.findByPlaceholderText(
      /Enter your first name/i
    );
    await userEvent.type(firstNameInput, "John");

    const lastNameInput = await screen.findByPlaceholderText(
      /Enter your last name/i
    );
    await userEvent.type(lastNameInput, "Doe");

    const emailInput = await screen.findByPlaceholderText(/Enter your Email/i);
    await userEvent.type(emailInput, "Email@123.com");

    const passwordInput = await screen.findByPlaceholderText(
      /Enter your Password/i
    );
    await userEvent.type(passwordInput, "Test@1234");

    const registerButton = screen.getByRole("button", { name: /Register/i });
    await userEvent.click(registerButton);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("Registration failed. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
