// Validate registration data
const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters",
    });
  }

  next();
};

// Validate login data
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  next();
};

// Validate event creation data
const validateEvent = (req, res, next) => {
  const {
    eventName,
    description,
    category,
    dateTime,
    location,
    price,
    priceCategory,
  } = req.body;

  if (
    !eventName ||
    !description ||
    !category ||
    !dateTime ||
    !location
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required event details",
    });
  }

  if (Number.isNaN(Date.parse(dateTime))) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid event date",
    });
  }

  if (
    price !== undefined &&
    (!Number.isFinite(Number(price)) || Number(price) < 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Price must be a valid non-negative number",
    });
  }

  if (
    priceCategory !== undefined &&
    !["Free", "Paid"].includes(priceCategory)
  ) {
    return res.status(400).json({
      success: false,
      message: "Price category must be Free or Paid",
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateEvent,
};