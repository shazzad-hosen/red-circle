import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const router = express.Router({ mergeParams: true });

router.get("/me", protect, getProfile);
router.patch("/me", protect, updateProfile);

export default router;