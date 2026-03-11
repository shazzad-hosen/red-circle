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
    throw new ExpressError(404, "User does not exist");
  }

  return {
    user: updatedUser,
  };
};

export const toggleDonarAvailability = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ExpressError(404, "User does not exist");
  }

  user.isAvailable = !user.isAvailable;

  await user.save();

  return {
    user,
  };
};

export const searchDonors = async (query) => {
  const bloodGroup = query.bloodGroup?.replace(/\s+/g, "+").toUpperCase();
  const city = query.city?.toLowerCase().trim();
  const area = query.area?.toLowerCase().trim();

  if (!bloodGroup || !city) {
    throw new ExpressError(400, "Blood group and city are required");
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const filter = {
    bloodGroup,
    "location.city": { $regex: `^${city}$`, $options: "i" },
    isAvailable: true,
    $or: [
      { lastDonationAt: { $lte: ninetyDaysAgo } },
      { lastDonationAt: { $exists: false } },
    ],
  };

  if (area) {
    filter["location.area"] = { $regex: `^${area}$`, $options: "i" };
  }

  const donors = await User.find(filter)
    .select("name bloodGroup location phone lastDonationAt isEligible")
    .sort({ lastDonationAt: 1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  return {
    page,
    limit,
    total,
    count: donors.length,
    totalPages: Math.ceil(total / limit),
    donors,
  };
};

export const updateDonation = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ExpressError(404, "User does not exist");
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

  return {
    lastDonationAt: user.lastDonationAt,
    isAvailable: user.isAvailable,
  };
};
