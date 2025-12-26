import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    ENV.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
    }
  );
};
