import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import validateRegister from "../middlewares/validateRegister.middleware.js";
import validateLogin from "../middlewares/validateLogin.middleware.js";
import protect from "../middlewares/auth.middleware.js";
import verifyRefreshToken from "../middlewares/verifyRefreshToken.middleware.js";

import {
  registerUserController,
  loginUserController,
  refreshUserTokenController,
  logoutUserController,
} from "../controllers/auth.controller.js";

import {
  registerLimiter,
  loginLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  validateRegister,
  asyncHandler(registerUserController),
);

router.post(
  "/login",
  loginLimiter,
  validateLogin,
  asyncHandler(loginUserController),
);

router.post(
  "/refresh",
  verifyRefreshToken,
  asyncHandler(refreshUserTokenController),
);

router.post("/logout", protect, asyncHandler(logoutUserController));

export default router;
