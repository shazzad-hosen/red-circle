import { User } from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";

export const getUserProfile = async (data) => {
  return {
    user: data,
  };
};

export const updateUserProfile = async (data, userId) => {
  const allowedFields = ["name", "phone", "location", "bloodGroup"];

  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new ExpressError(400, "No valid fields to update");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new ExpressError(404, "User not found");
  }

  return {
    user: updatedUser,
  };
};
