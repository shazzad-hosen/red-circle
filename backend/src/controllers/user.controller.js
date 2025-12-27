import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";

// Get Profile Route Logic
export const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// Update Profile Route Logic
export const updateProfile = async (req, res) => {
  const allowedFields = [
    "name",
    "phone",
    "location",
    "bloodGroup",
    "isAvailable",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new ExpressError(400, "No valid fields to update");
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new ExpressError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
};
