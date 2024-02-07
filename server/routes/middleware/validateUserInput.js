const { body, validationResult } = require("express-validator");

// Middleware for sanitizing and validating user input
const validateUserInput = [
  // Validate and sanitize email
  body("email")
    .trim() // Remove whitespace
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  // Validate password (you can adjust the rules as per your requirement)
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .optional({ nullable: true, checkFalsy: true }), // Make password optional

  // Validate role
  body("role")
    .isIn(["user", "admin", "super_admin"])
    .withMessage("Invalid role")
    .optional({ nullable: true, checkFalsy: true }), // Make role optional

  // Process the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUserInput;
