import express from "express";
import * as authController from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import validateRegister from "../middlewares/validateRegister.middleware.js";
import validateLogin from "../middlewares/validateLogin.middleware.js";
import protect from "../middlewares/auth.middleware.js";
import {
  registerLimiter,
  loginLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  validateRegister,
  asyncHandler(authController.register)
);

router.post(
  "/login",
  loginLimiter,
  validateLogin,
  asyncHandler(authController.login)
);

router.post("/refresh", asyncHandler(authController.refreshToken));
router.post("/logout", protect, authController.logout);

export default router;
