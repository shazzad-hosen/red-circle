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

  const userObject = user.toObject;
  delete userObject.password;

  return {
    userObject,
    accessToken,
    refreshToken,
  };
};
