import {
  getUserProfile,
  updateUserProfile,
  toggleDonarAvailability,
  searchDonors,
  updateDonation,
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

export const toggleDonarAvailabilityController = async (req, res) => {
  const result = await toggleDonarAvailability(req.user._id);

  res.status(200).json({
    success: true,
    message: `Donor is now ${result.user.isAvailable ? "available" : "unavailable"}`,
    data: {
      isAvailable: result.user.isAvailable,
    },
  });
};

export const searchDonorsController = async (req, res) => {
  const result = await searchDonors(req.query);

  res.status(200).json({
    success: true,
    data: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      count: result.count,
      totalPages: result.totalPages,
      donors: result.donors,
    },
  });
};

export const updateDonationController = async (req, res) => {
  const result = await updateDonation(req.user._id);

  res.status(200).json({
    success: true,
    message: "Donation recorded successfully",
    data: {
      lastDonationAt: result.lastDonationAt,
      isAvailable: result.isAvailable,
      eligibleAfterDays: 90,
    },
  });
};
