import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new ApiError(401, "No token provided"));
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      _id: decoded._id || decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return next(new ApiError(403, "Invalid token"));
  }
};
