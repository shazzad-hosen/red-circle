import express from "express";
import { ENV } from "./config/env.js";
import path from "path";
import ExpressError from "./utils/ExpressError.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
  });
}

// Handle Request For Invalid(404) Routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Route not found"));
});

// Custom Error Handler
app.use(errorHandler);

export default app;
