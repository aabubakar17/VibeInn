import { validationResult } from "express-validator";
import UserAuthenticationService from "../services/UserAuthenticationService.js";

export default class AuthController {
  #service;

  constructor(service = new UserAuthenticationService()) {
    this.#service = service;
  }

  handleValidationError = (res, errors) => {
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }
  };

  loginController = async (req, res) => {
    const errors = validationResult(req);
    this.handleValidationError(res, errors);
    const { email, password } = req.body;
    try {
      const { token, user } = await this.#service.login(email, password);

      res.status(200).json({ token, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  registerController = async (req, res) => {
    const errors = validationResult(req);
    this.handleValidationError(res, errors);
    const { firstName, lastName, email, password } = req.body;
    try {
      const { token, user } = await this.#service.register(
        firstName,
        lastName,
        email,
        password
      );
      res.status(201).json({ token, user });
    } catch (error) {
      if (error.status === 409) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  updatePassword = async (req, res) => {
    const errors = validationResult(req);
    this.handleValidationError(res, errors);

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      const result = await this.#service.updatePassword(
        userId,
        currentPassword,
        newPassword
      );
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Invalid password") {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  allowAccess = async (req, res) => {
    res.status(200).json({ id: req.id });
  };
}
