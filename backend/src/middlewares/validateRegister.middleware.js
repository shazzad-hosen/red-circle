import ExpressError from "../utils/ExpressError.js";

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ExpressError(400, "Name, email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ExpressError(400, "Please enter a valid email address");
  }

  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "protonmail.com",
    "icloud.com",
    "outlook.com",
    "hotmail.com",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  if (!allowedDomains.includes(domain)) {
    throw new ExpressError(400, "This email domain is not allowed");
  }

  if (password.length < 6) {
    throw new ExpressError(400, "Password must be at least 6 characters");
  }

  next();
};

export default validateRegister;
