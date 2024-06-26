import { Router } from "express";
import { query } from "express-validator";
import AccommodationController from "../controllers/AccommodationController.js";

export default class AccommodationRoutes {
  #controller;
  #router;
  #routeStartPoint;

  constructor(
    controller = new AccommodationController(),
    routeStartPoint = "/api"
  ) {
    this.#controller = controller;
    this.#routeStartPoint = routeStartPoint;
    this.#router = Router();
    this.#initialiseRoutes();
  }

  #initialiseRoutes = () => {
    this.#router.get(
      "/hotels",
      [
        query("location").notEmpty().isString(),
        query("checkIn").notEmpty().isString(),
        query("checkOut").notEmpty().isString(),
      ],
      this.#controller.searchHotels
    );
  };

  getRouter = () => {
    return this.#router;
  };

  getRouteStartPoint = () => {
    return this.#routeStartPoint;
  };
}
