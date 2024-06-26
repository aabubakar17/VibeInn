import { expect, use } from "chai";
import chaiExclude from "chai-exclude";
import sinon from "sinon";
import supertest from "supertest";
import Config from "../src/config/Config.js";
import Database from "../src/db/db.js";
import Server from "../src/server/Server.js";
import AuthController from "../src/controllers/authController.js";
import UserAuthenticationService from "../src/services/UserAuthenticationService.js";
import AuthRoutes from "../src/routes/authRoutes.js";
import User from "../src/models/User.js";
import AccommodationController from "../src/controllers/AccommodationController.js";
import AccommodationRoutes from "../src/routes/accomRoutes.js";
import Proxy from "../src/server/proxy.js";

use(chaiExclude);

describe("Intergration Tests", () => {
  let server;
  let request;
  let database;
  let authService;
  let proxy;

  before(async () => {
    Config.load();
    proxy = new Proxy();
    const accommodationController = new AccommodationController(proxy);
    const accommodationRoutes = new AccommodationRoutes(
      accommodationController
    );

    const { PORT, HOST, DB_URI } = process.env;
    authService = new UserAuthenticationService();
    const authController = new AuthController(authService);
    const authRoutes = new AuthRoutes(authController);
    database = new Database(DB_URI);
    await database.connect();
    server = new Server(PORT, HOST, authRoutes, accommodationRoutes);

    server.start();
    request = supertest(server.getApp());
  });

  after(async () => {
    await server.close();
  });
  describe("User Authentication Integration Tests", () => {
    describe("Login", () => {
      let loginStub;

      beforeEach(() => {
        loginStub = sinon.stub(authService, "login");
      });

      afterEach(() => {
        loginStub.restore();
      });

      it("should successfully log in with valid credentials", async () => {
        loginStub.resolves({
          token: "dummyToken",
          user: { id: 1, email: "test@example.com" },
        });

        const res = await request
          .post("/api/auth/login")
          .send({ email: "test@example.com", password: "password123" });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("user");
      });

      it("should fail login with invalid email", async () => {
        loginStub.rejects(new Error("Invalid email or password"));

        const res = await request
          .post("/api/auth/login")
          .send({ email: "invalidemail@example.com", password: "password123" });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("error", "Invalid email or password");
      });

      it("should fail login with incorrect password", async () => {
        loginStub.rejects(new Error("Invalid email or password"));

        const res = await request
          .post("/api/auth/login")
          .send({ email: "test@example.com", password: "incorrectpassword" });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("error", "Invalid email or password");
      });

      it("should fail login with missing email or password", async () => {
        const res = await request.post("/api/auth/login").send({});

        expect(res.status).to.equal(422);
        expect(res.body).to.have.property("error", "Validation failed");
      });
    });

    describe("Register", () => {
      let registerStub;
      beforeEach(async () => {
        await User.deleteMany();
      });

      afterEach(() => {
        if (registerStub) {
          registerStub.restore();
        }
      });

      it("should successfully register with valid details and return new user with token", async () => {
        const newUser = {
          email: "test@example.com",
          password: "password123",
          firstName: "Test",
          lastName: "User",
        };

        const res = await request.post("/api/auth/register").send(newUser);
        expect(res.status).to.equal(201);
        expect(res.body.user).to.have.property("email", "test@example.com");
        expect(res.body.user).to.have.property("firstName", "Test");
        expect(res.body.user).to.have.property("lastName", "User");
        expect(res.body).to.have.property("token");
      });

      it("should fail registration with existing email", async () => {
        const User = {
          email: "test@example.com",
          password: "password123",
          firstName: "Test",
          lastName: "User",
        };

        await request.post("/api/auth/register").send(User);
        const res = await request.post("/api/auth/register").send(User);
        expect(res.status).to.equal(409);
        expect(res.body).to.have.property("error", "Email already in use");
      });

      it("should fail registration with missing email", async () => {
        const incompleteUser = {
          email: "",
          password: "password123",
          firstName: "Test",
          lastName: "User",
        };

        const res = await request
          .post("/api/auth/register")
          .send(incompleteUser);
        expect(res.status).to.equal(422);
        expect(res.body).to.have.property("error", "Validation failed");
      });
      it("should send with a 500 status code if there is an error", async () => {
        registerStub = sinon.stub(authService, "register");
        registerStub.throws(new Error("Internal Server Error"));

        const User = {
          email: "test@example.com",
          password: "password123",
          firstName: "Test",
          lastName: "User",
        };
        const res = await request.post("/api/auth/register").send(User);

        expect(res.status).to.equal(500);
      });
    });
    describe("Update Password", () => {
      let token;

      beforeEach(async () => {
        await User.deleteMany();

        const newUser = {
          email: "test@example.com",
          password: "validCurrentPassword",
          firstName: "Test",
          lastName: "User",
        };

        const registerResponse = await request
          .post("/api/auth/register")
          .send(newUser);
        token = registerResponse.body.token;
      });

      it("should successfully update password with valid current password", async () => {
        const res = await request
          .put("/api/auth/update-password")
          .set("x-access-token", token)
          .send({
            currentPassword: "validCurrentPassword",
            newPassword: "newValidPassword",
          });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property(
          "message",
          "Password updated successfully"
        );
      });

      it("should fail password update with invalid current password", async () => {
        const res = await request
          .put("/api/auth/update-password")
          .set("x-access-token", token)
          .send({
            currentPassword: "invalidCurrentPassword",
            newPassword: "newValidPassword",
          });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("error", "Invalid password");
      });

      it("should fail password update with missing new password", async () => {
        const res = await request
          .put("/api/auth/update-password")
          .set("x-access-token", token)
          .send({
            currentPassword: "validCurrentPassword",
          });

        expect(res.status).to.equal(422);
        expect(res.body).to.have.property("error", "Validation failed");
      });
    });
  });

  describe("Accommodation Integration Tests", () => {
    describe("GET /api/hotels", () => {
      let searchHotelsStub;

      beforeEach(() => {
        searchHotelsStub = sinon.stub(proxy, "searchHotels");
      });

      afterEach(() => {
        searchHotelsStub.restore();
      });

      it("should return hotel data for a valid location and dates", async () => {
        searchHotelsStub.resolves([{ id: 1, name: "Test Hotel" }]);

        const res = await request.get("/api/hotels").query({
          location: "London",
          checkIn: "2024-08-15",
          checkOut: "2024-08-20",
        });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array").that.is.not.empty;
        expect(res.body[0]).to.have.property("name", "Test Hotel");
      });

      it("should return a validation error if required query parameters are missing", async () => {
        const res = await request.get("/api/hotels").query({});

        expect(res.status).to.equal(422);
        expect(res.body).to.have.property("error", "Validation failed");
      });

      it("should return a 500 error if the hotel search fails", async () => {
        searchHotelsStub.rejects(new Error("Failed to fetch hotel data"));

        const res = await request.get("/api/hotels").query({
          location: "London",
          checkIn: "2024-08-15",
          checkOut: "2024-08-20",
        });

        expect(res.status).to.equal(500);
        expect(res.body).to.have.property(
          "error",
          "Failed to fetch hotel data"
        );
      });
    });
  });
});
