import express from "express";
const router = express.Router({ mergeParams: true });
import { register, login } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import validateRegister from "../middlewares/validateRegister.middleware.js";
import validateLogin from "../middlewares/validateLogin.middleware.js";

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", validateLogin, asyncHandler(login));

export default router;