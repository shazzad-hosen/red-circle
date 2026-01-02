import express from "express";
import protect from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getProfile,
  updateProfile,
  toggleAvailability,
  searchDonors,
  updateDonation,
} from "../controllers/user.controller.js";

const router = express.Router();

router
  .route("/me")
  .get(protect, getProfile)
  .patch(protect, asyncHandler(updateProfile));

router.patch("/availability", protect, asyncHandler(toggleAvailability));
router.get("/donors", asyncHandler(searchDonors));
router.patch("/donation", protect, asyncHandler(updateDonation));

export default router;
