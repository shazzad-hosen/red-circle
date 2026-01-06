import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import { ENV } from "../config/env.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  let token;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]; // extracting the actual token
  }

  if (!token) {
    return next(new ExpressError(401, "Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // password filed excluded

    if (!user) {
      return next(new ExpressError(401, "User no longer exists"));
    }

    req.user = user; // Attaches the authenticated user object to the request

    next();
  } catch (error) {
    next(new ExpressError(401, "Not authorized, invalid token"));
  }
};

export default protect;
