import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });
};
