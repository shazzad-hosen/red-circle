import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import ExpressError from "../utils/ExpressError.js";

// Resister Route Logic
export const register = async (req, res) => {
  const { name, email, password, bloodGroup, location, phone } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
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
    const token = generateToken(user);

    res.status(201).json({
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Log in Route Logic
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
