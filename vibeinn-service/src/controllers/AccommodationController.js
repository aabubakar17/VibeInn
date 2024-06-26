import { validationResult } from "express-validator";
import Proxy from "../server/proxy.js";

export default class AccommodationController {
  #service;
  constructor(service = new Proxy()) {
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

  searchHotels = async (req, res) => {
    const errors = validationResult(req);
    this.handleValidationError(res, errors);

    const { location, checkIn, checkOut } = req.query;

    try {
      const data = await this.#service.searchHotels(
        location,
        checkIn,
        checkOut
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  getHotelReviews = async (req, res) => {
    const errors = validationResult(req);
    this.handleValidationError(res, errors);

    const { checkIn, checkOut } = req.query;
    const { id } = req.params;

    try {
      const data = await this.#service.getHotelReviews(id, checkIn, checkOut);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
