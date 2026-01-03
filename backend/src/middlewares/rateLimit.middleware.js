import rateLimit from "express-rate-limit";

// Donation update limiter
export const donationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2,
  message: {
    success: false,
    message: "Too many donation updates. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Availability toggle limiter
export const availabilityLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many availability changes. Slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public Search limiter
export const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  message: {
    success: false,
    message: "Too many search requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register Limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login Limiter
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});