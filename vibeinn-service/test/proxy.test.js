import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";
import Proxy from "../src/server/proxy.js";

describe("Proxy Unit Tests", () => {
  let axiosGetStub;
  let cacheGetStub;
  let cacheSetStub;
  let proxy;

  beforeEach(() => {
    proxy = new Proxy();

    axiosGetStub = sinon.stub(axios, "get");
    cacheGetStub = sinon.stub(proxy.cache, "get");
    cacheSetStub = sinon.stub(proxy.cache, "set");
  });

  afterEach(() => {
    axiosGetStub.restore();
    cacheGetStub.restore();
    cacheSetStub.restore();
    sinon.restore();
  });

  describe("searchLocation", () => {
    it("should return cached location data if available", async () => {
      const location = "London";
      const cachedData = { data: [{ geoId: "1" }] };
      cacheGetStub.withArgs(location).returns(cachedData);

      const result = await proxy.searchLocation(location);
      expect(result).to.deep.equal(cachedData);
      expect(axiosGetStub.called).to.be.false;
    });

    it("should throw an error if fetching location data fails", async () => {
      const location = "London";
      axiosGetStub.rejects(new Error("API error"));

      try {
        await proxy.searchLocation(location);
      } catch (error) {
        expect(error.message).to.equal("Failed to fetch location data");
      }
    });
  });

  describe("searchHotels", () => {
    let searchLocationStub;

    beforeEach(() => {
      searchLocationStub = sinon.stub(proxy, "searchLocation");
    });

    afterEach(() => {
      searchLocationStub.restore();
    });
    it("should return cached hotel data if available", async () => {
      const location = "London";
      const geoID = "1";
      const cacheKey = `${geoID}-2024-08-15-2024-08-20`;
      const cachedData = [{ id: 1, name: "Test Hotel" }];
      searchLocationStub
        .withArgs(location)
        .resolves({ data: [{ geoId: geoID }] });
      proxy.cache.set(`${location}-geoID`, geoID);
      cacheGetStub.withArgs(cacheKey).returns(cachedData);

      const result = await proxy.searchHotels(
        location,
        "2024-08-15",
        "2024-08-20"
      );
      expect(result).to.deep.equal(cachedData);
      expect(axiosGetStub.called).to.be.false;
    });

    it("should throw an error if fetching hotel data fails", async () => {
      const location = "London";
      const geoID = "1";
      searchLocationStub
        .withArgs(location)
        .resolves({ data: [{ geoId: geoID }] });
      axiosGetStub.onCall(0).resolves({ data: { data: [{ geoId: geoID }] } });
      axiosGetStub.onCall(1).rejects(new Error("API error"));

      try {
        await proxy.searchHotels(location, "2024-08-15", "2024-08-20");
      } catch (error) {
        expect(error.message).to.equal("Failed to fetch hotel data");
      }
    });
  });

  describe("getHotelReviews", () => {
    it("should return cached review data if available", async () => {
      const hotelID = "1";
      const cacheKey = `${hotelID}-2024-08-15-2024-08-20`;
      const cachedData = [{ id: 1, review: "Test Review" }];
      cacheGetStub.withArgs(cacheKey).returns(cachedData);

      const result = await proxy.getHotelReviews(
        hotelID,
        "2024-08-15",
        "2024-08-20"
      );

      expect(result).to.deep.equal(cachedData);
      expect(axiosGetStub.called).to.be.false;
    });

    it("should throw an error if fetching review data fails", async () => {
      const hotelID = "1";
      axiosGetStub.rejects(new Error("API error"));

      try {
        await proxy.getHotelReviews(hotelID, "2024-08-15", "2024-08-20");
      } catch (error) {
        expect(error.message).to.equal("Failed to fetch hotel reviews");
      }
    });
  });
  describe("getSentiment", () => {
    it("should correctly cache sentiment analysis result", async () => {
      const reviewText = ["This is a great hotel!"];
      const expectedScore = 9;

      const mockPipeFunction = sinon
        .stub()
        .resolves([{ label: "POSITIVE", score: 0.8 }]);
      proxy.pipe = mockPipeFunction;

      const result = await proxy.getSentiment(reviewText);

      expect(result[0]).to.equal(expectedScore);
      expect(cacheSetStub.calledOnce).to.be.true;
    });
    it("should handle error during sentiment analysis gracefully", async () => {
      const error = new Error("Pipeline initialization failed");
      sinon.stub(proxy, "pipe").get(() => {
        throw error;
      });

      const reviewText = ["This is a great hotel!"];

      try {
        await proxy.getSentiment(reviewText);
      } catch (err) {
        console.log(err);
        expect(err).to.equal(error);
      }
    });
  });
});
