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
  const allowedFields = ["name", "phone", "location", "bloodGroup"];

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

// Donor Availability Toggler Route
export const toggleAvailability = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  user.isAvailable = !user.isAvailable;

  await user.save();

  res.status(200).json({
    success: true,
    isAvailable: user.isAvailable,
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

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const filter = {
    bloodGroup,
    "location.city": city,
    isAvailable: true,
    $or: [
      { lastDonationAt: { $lte: ninetyDaysAgo } },
      { lastDonationAt: { $exists: false } },
    ],
  };

  if (area) {
    filter["location.area"] = area;
  }

  const donors = await User.find(filter)
    .select("name bloodGroup location phone lastDonationAt isEligible")
    .sort({ lastDonationAt: 1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    count: donors.length,
    donors,
  });
};

// Donation Update Route
export const updateDonation = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  const currentDate = Date.now();

  if (user.lastDonationAt) {
    const daysSinceLastDonation =
      (currentDate - user.lastDonationAt.getDate()) / (1000 * 60 * 60 * 24);

    if (daysSinceLastDonation < 90) {
      throw new ExpressError(
        400,
        `You can donate again after ${Math.ceil(
          90 - daysSinceLastDonation
        )} days`
      );
    }
  }

  user.lastDonationAt = currentDate;
  user.isAvailable = false;

  await user.save();

  res.send(200).json({
    success: true,
    message: "Donation recorded successfully",
    lastDonationAt: user.lastDonationAt,
    isAvailable: user.isAvailable,
    eligibleAfterDays: 90,
  });
};
