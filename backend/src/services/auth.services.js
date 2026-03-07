import { User } from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { ENV } from "../config/env.js";
import crypto from "crypto";
import parseExpiryToMs from "../utils/parseExpiry.js";

export const registerUser = async (data) => {
  const { name, email, password, bloodGroup, location, phone } = data;

  if (!name || !email || !password || !bloodGroup || !location?.city) {
    throw new ExpressError(400, "Missing required fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ExpressError(400, "Email already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    bloodGroup,
    location,
    phone,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const refreshExpiry = new Date(
    Date.now() + parseExpiryToMs(ENV.REFRESH_TOKEN_EXPIRY),
  );

  await RefreshToken.create({
    user: user._id,
    token: hashedToken,
    expiresAt: refreshExpiry,
  });

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (data, meta) => {
  const { email, password } = data;
  const { userAgent, ip } = meta;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ExpressError(401, "Invalid credentials");
  }

  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    throw new ExpressError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const refreshExpiry = new Date(
    Date.now() + parseExpiryToMs(ENV.REFRESH_TOKEN_EXPIRY),
  );

  await RefreshToken.create({
    user: user._id,
    token: hashedToken,
    expiresAt: refreshExpiry,
    userAgent,
    ip,
  });

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (userId, existingRefreshToken, meta) => {
  await RefreshToken.deleteOne({ _id: existingRefreshToken._id });

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);

  const hashedToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  const refreshExpiry = new Date(
    Date.now() + parseExpiryToMs(ENV.REFRESH_TOKEN_EXPIRY),
  );

  await RefreshToken.create({
    user: userId,
    token: hashedToken,
    expiresAt: refreshExpiry,
    userAgent: meta.userAgent,
    ip: meta.ip,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (userId, incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ExpressError(400, "Refresh token missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(incomingRefreshToken)
    .digest("hex");

  const deleted = await RefreshToken.findOneAndDelete({
    token: hashedToken,
    user: userId,
  });

  if (!deleted) {
    throw new ExpressError(400, "Refresh token already invalid or expired");
  }

  return { message: "Logged out successfully" };
};
