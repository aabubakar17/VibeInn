import { Router } from "express";
import { body } from "express-validator";
import ReviewController from "../controllers/ReviewController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export default class ReviewRoutes {
  #controller;
  #router;
  #routeStartPoint;
  #AuthMiddleware;

  constructor(
    controller = new ReviewController(),
    routeStartPoint = "/api/review"
  ) {
    this.#controller = controller;
    this.#routeStartPoint = routeStartPoint;
    this.#router = Router();
    this.#AuthMiddleware = new AuthMiddleware();
    this.#initialiseRoutes();
  }

  #initialiseRoutes = () => {
    this.#router.post(
      "/submit", // POST /api/review/submit
      [this.#AuthMiddleware.verify],
      [
        body("reviewText").notEmpty().isString(),
        body("accommodationId").notEmpty().isString(),
      ],
      this.#controller.submitReview
    );
  };

  getRouter = () => {
    return this.#router;
  };

  getRouteStartPoint = () => {
    return this.#routeStartPoint;
  };
}
