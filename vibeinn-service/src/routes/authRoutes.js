import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/authController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export default class AuthRoutes {
  #controller;
  #router;
  #routeStartPoint;
  #AuthMiddleware;

  constructor(
    controller = new AuthController(),
    routeStartPoint = "/api/auth"
  ) {
    this.#controller = controller;
    this.#routeStartPoint = routeStartPoint;
    this.#router = Router();
    this.#AuthMiddleware = new AuthMiddleware();
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
      [this.#AuthMiddleware.verify],
      [
        body("currentPassword").notEmpty().isString(),
        body("newPassword").notEmpty().isString(),
      ],
      this.#controller.updatePassword
    );

    this.#router.post(
      "/user",
      [this.#AuthMiddleware.verify, this.#AuthMiddleware.isUser],
      this.#controller.allowAccess
    );

    this.#router.post(
      "/admin",
      [this.#AuthMiddleware.verify, this.#AuthMiddleware.isAdmin],
      this.#controller.allowAccess
    );
  };

  getRouter = () => {
    return this.#router;
  };

  getRouteStartPoint = () => {
    return this.#routeStartPoint;
  };
}
