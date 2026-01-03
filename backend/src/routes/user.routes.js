import express from "express";
import protect from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getProfile,
  updateProfile,
  toggleAvailability,
  updateDonation,
  searchDonors,
} from "../controllers/user.controller.js";
import {
  donationLimiter,
  availabilityLimiter,
  searchLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/me")
  .get(protect, getProfile)
  .patch(protect, asyncHandler(updateProfile));

router.patch(
  "/donation",
  protect,
  donationLimiter,
  asyncHandler(updateDonation)
);

router.patch(
  "/availability",
  protect,
  availabilityLimiter,
  asyncHandler(toggleAvailability)
);

router.get("/donors", searchLimiter, asyncHandler(searchDonors));

export default router;
