import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import ExpressError from "../utils/ExpressError.js";
import { ENV } from "../config/env.js";

// Resister Route
export const register = async (req, res) => {
  const { name, email, password, bloodGroup, location, phone } = req.body;

  if (!name || !email || !password || !bloodGroup || !location?.city) {
    throw new ExpressError(400, "Missing required fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ExpressError(400, "Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    bloodGroup,
    location,
    phone,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        location: user.location,
        phone: user.phone,
        isAvailable: user.isAvailable,
      },
    },
  });
};

// Log in Route
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    throw new ExpressError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ExpressError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bloodGroup: user.bloodGroup,
        location: user.location,
        phone: user.phone,
        isAvailable: user.isAvailable,
      },
    },
  });
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ExpressError(401, "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ExpressError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    throw new ExpressError(401, "Refresh token mismatch");
  }

  const newAccessToken = generateAccessToken(user);

  res.status(200).json({
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
};

// Log out Route
export const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
