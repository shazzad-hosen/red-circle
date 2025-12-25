import ExpressError from "../utils/ExpressError.js";

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ExpressError(400, "Email and password are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ExpressError(400, "Invalid email address");
  }

  next();
};

export default validateLogin;
