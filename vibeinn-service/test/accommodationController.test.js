import { expect } from "chai";
import { validationResult } from "express-validator";
import sinon from "sinon";
import AccommodationController from "../src/controllers/AccommodationController.js";

describe("AccommodationController Unit Tests", () => {
  let accommodationController;
  let proxy;
  let req;
  let res;
  let next;

  beforeEach(() => {
    proxy = {
      searchHotels: sinon.stub(),
      getHotelReviews: sinon.stub(),
      getSentiment: sinon.stub(),
    };
    accommodationController = new AccommodationController(proxy);

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("searchHotels", () => {
    it("should return hotel data if search is successful", async () => {
      req = {
        query: {
          location: "London",
          checkIn: "2024-08-15",
          checkOut: "2024-08-20",
        },
      };

      proxy.searchHotels.resolves([{ id: 1, name: "Test Hotel" }]);

      await accommodationController.searchHotels(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith([{ id: 1, name: "Test Hotel" }])).to.be.true;
    });

    it("should return a 500 error if the hotel search fails", async () => {
      proxy.searchHotels.rejects(new Error("Failed to fetch hotel data"));

      await accommodationController.searchHotels(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Failed to fetch hotel data" })).to.be
        .true;
    });
  });

  describe("getHotelReviews", () => {
    it("should return hotel review data if search is successful", async () => {
      req = {
        query: {
          checkIn: "2024-08-15",
          checkOut: "2024-08-20",
        },
        params: {
          id: "1",
        },
      };

      proxy.getHotelReviews.resolves([{ id: 1, name: "Test Hotel" }]);

      await accommodationController.getHotelReviews(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith([{ id: 1, name: "Test Hotel" }])).to.be.true;
    });

    it("should return a 500 error if the hotel review search fails", async () => {
      proxy.getHotelReviews.rejects(
        new Error("Failed to fetch hotel review data")
      );

      await accommodationController.getHotelReviews(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({ error: "Failed to fetch hotel review data" })
      ).to.be.true;
    });
  });

  describe("getSentiment", () => {
    it("should return sentiment score if sentiment analysis is successful", async () => {
      req = {
        body: {
          reviewText: "This is a test review",
        },
      };

      proxy.getSentiment.resolves(0.5);

      await accommodationController.getSentiment(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ sentimentScore: 0.5 })).to.be.true;
    });

    it("should return a 500 error if the sentiment analysis fails", async () => {
      proxy.getSentiment.rejects(new Error("Failed to analyse sentiment"));

      await accommodationController.getSentiment(req, res, next);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Failed to analyse sentiment" })).to
        .be.true;
    });
  });
});
