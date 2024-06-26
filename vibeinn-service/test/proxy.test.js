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
});
