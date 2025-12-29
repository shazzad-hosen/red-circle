import express from "express";
import protect from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getProfile,
  updateProfile,
  toggleAvailability,
} from "../controllers/user.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/me", protect, getProfile);
router.patch("/me", protect, asyncHandler(updateProfile));
router.patch("/availability", protect, asyncHandler(toggleAvailability));

export default router;