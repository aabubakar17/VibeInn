import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";
import UserAuthenticationService from "../src/services/UserAuthenticationService.js";

describe("UserAuthenticationService", () => {
  let authService;

  beforeEach(() => {
    authService = new UserAuthenticationService();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("login", () => {
    it("should throw an error if the user does not exist", async () => {
      sinon.stub(User, "findOne").returns(null);

      try {
        await authService.login("example@123.com", "password");
      } catch (err) {
        expect(err.message).to.equal("Invalid email or password");
      }
    });

    it("should throw an error if the password does not match", async () => {
      const user = {
        _id: "id",
        email: "example@123.com",
        password: "hashedpassword",
      };
      sinon.stub(User, "findOne").returns(user);
      sinon.stub(bcrypt, "compare").returns(false);

      try {
        await authService.login("example@123.com", "password");
      } catch (err) {
        expect(err.message).to.equal("Invalid email or password");
      }
    });

    it("should return a token and user if the login is successful", async () => {
      const user = {
        _id: "id",
        firstName: "Test",
        lastName: "User",
        email: "example@123.com",
        password: "hashedpassword",
        role: "user",
      };
      sinon.stub(User, "findOne").returns(user);
      sinon.stub(bcrypt, "compare").returns(true);
      sinon.stub(jwt, "sign").returns("token");

      const result = await authService.login("example@123.com", "password");

      expect(result).to.deep.equal({
        token: "token",
        user: {
          id: "id",
          email: "example@123.com",
          role: "user",
          firstName: "Test",
          lastName: "User",
        },
      });
    });
  });

  describe("register", () => {
    it("should throw an error if the email is already in use", async () => {
      sinon.stub(User, "findOne").returns({ email: "example.test.com" });

      try {
        await authService.register(
          "example@123.com",
          "password",
          "Test",
          "User"
        );
      } catch (err) {
        expect(err.message).to.equal("Email already in use");
        expect(err.status).to.equal(409);
      }
    });

    it(`should return a token and user if the registration is successful`, async () => {
      sinon.stub(User, "findOne").returns(null);
      sinon.stub(User.prototype, "save");
      sinon.stub(bcrypt, "hash").returns("hashedPassword");
      sinon.stub(jwt, "sign").returns("token");

      const result = await authService.register(
        "Test",
        "User",
        "example@test.com",
        "password"
      );

      expect(result).to.have.property("token", "token");
      expect(result.user).to.have.property("email", "example@test.com");
      expect(result.user).to.have.property("firstName", "Test");
      expect(result.user).to.have.property("lastName", "User");
      expect(result.user).to.have.property("role", "user");
    });
  });

  describe("updatePassword", () => {
    let findByIdStub;
    let saveStub;
    let compareStub;
    let hashStub;

    beforeEach(() => {
      findByIdStub = sinon.stub(User, "findById");
      saveStub = sinon.stub(User.prototype, "save");
      compareStub = sinon.stub(bcrypt, "compare");
      hashStub = sinon.stub(bcrypt, "hash");
    });

    afterEach(() => {
      findByIdStub.restore();
      saveStub.restore();
      compareStub.restore();
      hashStub.restore();
    });

    it("should update password successfully with valid current password", async () => {
      const userId = "testId";
      const currentPassword = "validCurrentPassword";
      const newPassword = "newValidPassword";

      const user = {
        _id: userId,
        password: "hashedPassword",
        save: saveStub,
      };

      findByIdStub.resolves(user);
      compareStub.resolves(true);
      hashStub.resolves("newHashedPassword");

      const result = await authService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );

      expect(result).to.deep.equal({
        message: "Password updated successfully",
      });
      expect(saveStub.calledOnce).to.be.true;
      expect(user.password).to.equal("newHashedPassword");
    });

    it("should throw error with invalid current password", async () => {
      const userId = "testId";
      const currentPassword = "invalidCurrentPassword";
      const newPassword = "newValidPassword";

      const user = {
        _id: userId,
        password: "hashedPassword",
        save: saveStub,
      };

      findByIdStub.resolves(user);
      compareStub.resolves(false);

      try {
        await authService.updatePassword(userId, currentPassword, newPassword);
      } catch (error) {
        expect(error.message).to.equal("Invalid password");
      }

      expect(saveStub.notCalled).to.be.true;
    });

    it("should throw error if user is not found", async () => {
      const userId = "nonExistentId";
      const currentPassword = "validCurrentPassword";
      const newPassword = "newValidPassword";

      findByIdStub.resolves(null);

      try {
        await authService.updatePassword(userId, currentPassword, newPassword);
      } catch (error) {
        expect(error.message).to.equal("User not found");
      }

      expect(saveStub.notCalled).to.be.true;
    });
  });
});
