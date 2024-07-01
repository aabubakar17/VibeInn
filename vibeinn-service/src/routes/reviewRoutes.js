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
    this.#router.put(
      "/update", // PUT /api/review/update
      [this.#AuthMiddleware.verify],
      [
        body("reviewText").notEmpty().isString(),
        body("reviewId").notEmpty().isString(),
      ],
      this.#controller.updateReview
    );

    this.#router.delete(
      "/delete", // DELETE /api/review/delete
      [this.#AuthMiddleware.verify],
      [body("reviewId").notEmpty().isString()],
      this.#controller.deleteReview
    );

    this.#router.get(
      "/user/:userId", // GET /api/review/user/:userId
      [this.#AuthMiddleware.verify], // Optionally add authentication middleware if needed
      (req, res) => this.#controller.getReviewsByUserId(req, res)
    );
  };

  getRouter = () => {
    return this.#router;
  };

  getRouteStartPoint = () => {
    return this.#routeStartPoint;
  };
}
