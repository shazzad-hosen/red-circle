import express from "express";
import protect from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as userController from "../controllers/user.controller.js";
import * as rateLimiters from "../middlewares/rateLimit.middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/me", protect, asyncHandler(userController.getProfile));

router.patch("/me", protect, asyncHandler(userController.updateProfile));

router.patch(
  "/donation",
  protect,
  rateLimiters.donationLimiter,
  asyncHandler(userController.updateDonation)
);

router.patch(
  "/availability",
  protect,
  rateLimiters.availabilityLimiter,
  asyncHandler(userController.toggleAvailability)
);

router.get(
  "/donors",
  rateLimiters.searchLimiter,
  asyncHandler(userController.searchDonors)
);

export default router;