import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwt.js";
import ExpressError from "../utils/ExpressError.js";

// Resister Route Logic
export const register = async (req, res) => {
  const { name, email, password, bloodGroup, location, phone } = req.body;

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

  const token = generateAccessToken(user);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      location: user.location,
      phone: user.phone,
      isAvailable: user.isAvailable,
    },
  });
};

// Log in Route Logic
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ExpressError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ExpressError(401, "Invalid credentials");
  }

  const token = generateAccessToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      bloodGroup: user.bloodGroup,
      location: user.location,
      phone: user.phone,
      isAvailable: user.isAvailable,
    },
  });
};
