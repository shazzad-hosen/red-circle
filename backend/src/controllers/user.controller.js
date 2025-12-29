import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";

// Get Profile Route
export const getProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// Update Profile Route
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

// Donor Availability Route
export const toggleAvailability = async (req, res) => {
  const { isAvailable } = req.body;

  if (typeof isAvailable !== "boolean") {
    throw new ExpressError(400, "isAvailable must be true or false");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  user.isAvailable = isAvailable;

  await user.save();
  res.status(200).json({
    success: true,
    message: `Donar is now ${isAvailable ? "available" : "unavailable"}`,
  });
};

// Donar Search Route
export const searchDonors = async (req, res) => {
  const rawBloodGroup = req.query.bloodGroup || "";
  const bloodGroup = rawBloodGroup.replace(/\s+/g, "+").toUpperCase();

  const city = req.query.city?.toLowerCase().trim();
  const area = req.query.area?.toLowerCase().trim();

  if (!bloodGroup || !city) {
    throw new ExpressError(400, "bloodGroup and city are required");
  }

  const filter = {
    bloodGroup,
    "location.city": city,
    isAvailable: true,
  };

  if (area) {
    filter["location.area"] = area;
  }

  const donors = await User.find(filter).select(
    "name bloodGroup location phone lastDonationAt"
  );

  res.status(200).json({
    success: true,
    count: donors.length,
    donors,
  });
};
