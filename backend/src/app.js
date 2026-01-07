import express from "express";
import { ENV } from "./config/env.js";
import ExpressError from "./utils/ExpressError.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend API is running successfully" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Handle Request For Invalid(404) Routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Route not found"));
});

// Custom Error Handler
app.use(errorHandler);

export default app;
