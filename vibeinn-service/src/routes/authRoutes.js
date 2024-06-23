import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/authController.js";
import authenticateJWT from "../middlewares/authenticateJWT.js";

export default class AuthRoutes {
  #controller;
  #router;
  #routeStartPoint;

  constructor(
    controller = new AuthController(),
    routeStartPoint = "/api/auth"
  ) {
    this.#controller = controller;
    this.#routeStartPoint = routeStartPoint;
    this.#router = Router();
    this.#initialiseRoutes();
  }

  #initialiseRoutes = () => {
    this.#router.post(
      "/login",
      [
        body(`email`).notEmpty().isString(),
        body(`password`).notEmpty().isString(),
      ],
      this.#controller.loginController
    );

    this.#router.post(
      "/register",
      [
        body("firstName").notEmpty().isString(),
        body("lastName").notEmpty().isString(),
        body(`email`).notEmpty().isString(),
        body(`password`).notEmpty().isString(),
      ],
      this.#controller.registerController
    );

    this.#router.put(
      "/update-password",
      authenticateJWT,
      [
        body("currentPassword").notEmpty().isString(),
        body("newPassword").notEmpty().isString(),
      ],
      this.#controller.updatePassword
    );
  };

  getRouter = () => {
    return this.#router;
  };

  getRouteStartPoint = () => {
    return this.#routeStartPoint;
  };
}
