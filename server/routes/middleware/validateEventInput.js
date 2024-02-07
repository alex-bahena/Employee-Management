const { body, validationResult } = require("express-validator");

const validateEventInput = [
  // Validate and sanitize the title
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),

  // Validate the description
  body("description")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),

  // Validate the days
  body("days")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Days are required")
    .custom((value) => {
      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const daysArray = value.split(",").map((day) => day.trim());
      return daysArray.every((day) => validDays.includes(day));
    })
    .withMessage("Invalid days format or value"),
  // Validate start_date (example format: 'YYYY-MM-DDTHH:mm:ss')
  body("start_date")
    .not()
    .isEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .toDate(),

  // Validate end_date (example format: 'YYYY-MM-DDTHH:mm:ss')
  body("end_date")
    .not()
    .isEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .toDate(),

  // Validate the all_day boolean
  body("all_day")
    .optional()
    .isBoolean()
    .withMessage("All day must be a boolean"),

  // Validate the event_type
  body("event_type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Event type is required"),

  // Validate hours if provided
  body("hours")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Hours must be a non-negative number"),

  // Process the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateEventInput;
