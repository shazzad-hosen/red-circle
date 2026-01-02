import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import validateRegister from "../middlewares/validateRegister.middleware.js";
import validateLogin from "../middlewares/validateLogin.middleware.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", validateLogin, asyncHandler(login));
router.post("/logout", protect, logout);

export default router;
