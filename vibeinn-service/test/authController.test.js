import { expect } from "chai";
import sinon from "sinon";
import AuthController from "../src/controllers/authController.js";

describe("AuthController", () => {
  let authService;
  let authController;

  beforeEach(() => {
    authService = {
      login: sinon.stub(),
      register: sinon.stub(),
      updatePassword: sinon.stub(),
    };
    authController = new AuthController(authService);
  });

  describe("loginController", () => {
    it("should login user and return token and user if credentials are valid", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const testToken = "testToken";
      const testUser = { id: 1, email: "test@example.com" };
      authService.login.resolves({ token: testToken, user: testUser });

      await authController.loginController(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ token: testToken, user: testUser })).to
        .be.true;

      sinon.restore();
    });

    it("should return 401 error if login fails", async () => {
      const req = { body: { email: "test@example.com", password: "password" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };
      const next = sinon.spy();

      authService.login.throws(new Error("Login failed"));

      await authController.loginController(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Login failed" })).to.be.true;

      sinon.restore();
    });
  });

  describe("registerController", () => {
    afterEach(() => {
      sinon.restore();
    });
    it("should register user and return token and user if registration is successful", async () => {
      const req = {
        body: {
          email: "example@test.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const testToken = "testToken";
      const testUser = {
        id: 1,
        email: "example@test.com",
        firstName: "Test",
        lastName: "User",
      };
      authService.register.resolves({ token: testToken, user: testUser });
      await authController.registerController(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch({ token: testToken, user: testUser })).to
        .be.true;
    });

    it("should throw 409 error when user already exist", async () => {
      const req = {
        body: {
          email: "example@test.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      authService.register.throws({
        status: 409,
        message: "Email already in use",
      });

      await authController.registerController(req, res);
      expect(res.status.calledWith(409)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Email already in use" })).to.be
        .true;
    });

    it("should respond with 500 status when there is a error", async () => {
      const req = {
        body: {
          email: "example@test.com",
          password: "password",
          firstName: "Test",
          lastName: "User",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      authService.register.throws(new Error("Internal Server Error"));

      await authController.registerController(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Internal Server Error" })).to.be
        .true;
    });
  });

  describe("updatePassword", () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        body: {
          currentPassword: "validCurrentPassword",
          newPassword: "newValidPassword",
        },
        user: {
          id: "testUserId",
        },
      };

      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis(),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should successfully update password with valid current password", async () => {
      authService.updatePassword.resolves({
        message: "Password updated successfully",
      });

      await authController.updatePassword(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "Password updated successfully" }))
        .to.be.true;
    });

    it("should return 401 with invalid current password", async () => {
      authService.updatePassword.rejects(new Error("Invalid password"));

      await authController.updatePassword(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ error: "Invalid password" })).to.be.true;
    });
  });
});
