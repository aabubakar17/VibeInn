import axios from "axios";
import authService from "../src/services/auth.service";
import { test } from "vitest";

vi.mock("axios");

describe("authService", () => {
  describe("login", () => {
    test("should  respond with user data when valid credential", async () => {
      // Arrange
      const email = "test@email.com";
      const password = "validPassword";
      const response = {
        data: { token: "tokenID" },
        user: { email: email, id: "userID" },
      };

      axios.post.mockResolvedValue(response);

      // Act
      const result = await authService.login(email, password);

      // Assert
      expect(result).toEqual(response.data);
    });
    test("should throw an error when request return error", async () => {
      // Arrange

      axios.post.mockRejectedValue(new Error("Error"));

      // Act and Assert
      await expect(() => authService.login()).rejects.toThrow("Error");
    });
  });

  describe("register", () => {
    test("should call respond with user data when valid credential", async () => {
      // Arrange
      const firstName = "John";
      const lastName = "Doe";
      const email = "test@email.com";
      const password = "validPassword";
      const response = {
        data: { token: "tokenID", user: { email: email, id: "userID" } },
      };

      axios.post.mockResolvedValue(response);

      // Act
      const result = await authService.register(
        firstName,
        lastName,
        email,
        password
      );

      // Assert
      expect(result).toEqual(response.data);
    });

    test("should throw an error when request return error ", async () => {
      // Arrange
      axios.post.mockRejectedValue(new Error("Error"));

      // Act and Assert
      await expect(() => authService.register()).rejects.toThrow("Error");
    });
  });

  /* describe("logout", () => {
    test("should remove user data from local storage", () => {
      // Arrange
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: "tokenID",
          user: { email: "test@email.com", id: "userID" },
        })
      );

      // Act
      authService.logout();

      // Assert
      expect(localStorage.getItem("user")).toBeNull();
    });
  }); */
});
