import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
  });
};
