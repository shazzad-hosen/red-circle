import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import { ENV } from "../config/env.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  let token;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new ExpressError(401, "Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password",
    );

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
