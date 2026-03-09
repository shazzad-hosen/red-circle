import { User } from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";

import {
  getUserProfile,
  updateUserProfile,
} from "../services/user.services.js";

export const getUserProfileController = async (req, res) => {
  const result = await getUserProfile(req.user);

  res.status(200).json({
    success: true,
    data: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      bloodGroup: result.user.bloodGroup,
      location: result.user.location,
      phone: result.user.phone,
      isAvailable: result.user.isAvailable,
    },
  });
};

export const updateUserProfileController = async (req, res) => {
  const result = await updateUserProfile(req.body, req.user._id);

  res.status(200).json({
    success: true,
    message: "User updation successful",
    data: {
      id: result.user._id,
      name: result.user.name,
      email: result.user.email,
      bloodGroup: result.user.bloodGroup,
      location: result.user.location,
      phone: result.user.phone,
      isAvailable: result.user.isAvailable,
    },
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
    message: `Donor is now ${user.isAvailable ? "available" : "unavailable"}`,
    data: {
      isAvailable: user.isAvailable,
    },
  });
};

// Donor Search Route
export const searchDonors = async (req, res) => {
  const bloodGroup = req.query.bloodGroup?.replace(/\s+/g, "+").toUpperCase();
  const city = req.query.city?.toLowerCase().trim();
  const area = req.query.area?.toLowerCase().trim();

  if (!bloodGroup || !city) {
    throw new ExpressError(400, "Blood group and city are required");
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
    data: {
      page,
      limit,
      total,
      count: donors.length,
      totalPages: Math.ceil(total / limit),
      donors,
    },
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
    const daysSince =
      (currentDate - user.lastDonationAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince < 90) {
      throw new ExpressError(
        400,
        `You can donate again after ${Math.ceil(90 - daysSince)} days`,
      );
    }
  }

  user.lastDonationAt = currentDate;
  user.isAvailable = false;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Donation recorded successfully",
    data: {
      lastDonationAt: user.lastDonationAt,
      isAvailable: user.isAvailable,
      eligibleAfterDays: 90,
    },
  });
};
