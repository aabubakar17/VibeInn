import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default class AuthMiddleware {
  verify = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: `Unauthorised` });
        }

        req.user = decoded;
        next();
      });
    } else {
      res.status(401).json({ message: `Unauthorised, no token` });
    }
  };

  isUser = async (req, res, next) => {
    const user = await User.findById(req.id);
    if (user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can access this resource" });
    }
    next();
  };

  isAdmin = async (req, res, next) => {
    const admin = await User.findById(req.id);
    if (admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can access this resource" });
    }
    next();
  };
}
