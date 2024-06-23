import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).send({ message: `Unauthorised` });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: `Unauthorised, no token` });
  }
};

export default authenticateJWT;
