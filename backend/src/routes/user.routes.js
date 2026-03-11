import express from "express";
import protect from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  donationLimiter,
  availabilityLimiter,
  searchLimiter,
} from "../middlewares/rateLimit.middleware.js";

import {
  getUserProfileController,
  updateUserProfileController,
  toggleDonarAvailabilityController,
  searchDonorsController,
  updateDonationController,
} from "../controllers/user.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/me", protect, asyncHandler(getUserProfileController));

router.patch("/me", protect, asyncHandler(updateUserProfileController));

router.patch(
  "/donation",
  protect,
  donationLimiter,
  asyncHandler(updateDonationController),
);

router.patch(
  "/availability",
  protect,
  availabilityLimiter,
  asyncHandler(toggleDonarAvailabilityController),
);

router.get("/donors", searchLimiter, asyncHandler(searchDonorsController));

export default router;
