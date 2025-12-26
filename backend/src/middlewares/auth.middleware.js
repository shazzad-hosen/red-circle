import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import { ENV } from "../config/env";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
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
    req.user = user;

    next();
  } catch (error) {
    next(new ExpressError(401, "Not authorized, invalid token"));
  }
};

export default protect;