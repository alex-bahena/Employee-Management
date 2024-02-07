const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const Employee = require("../../models/employee-models/EmployeeModel");
const Event = require("../../models/EventModel");
const authenticate = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin");
const validateUserInput = require("../middleware/validateUserInput");
const validateEventInput = require("../middleware/validateEventInput");
const rateLimit = require("express-rate-limit"); // Rate limiting middleware

// Apply rate limiting to login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Get all employees with optional event type filtering (admin only)
router.get("/", [authenticate, isAdmin], async (req, res) => {
  try {
    const eventTypeFilter = req.query.eventType; // Get eventType query parameter

    let includeOptions = {
      model: Event,
      as: "events",
      attributes: [
        "title",
        "description",
        "days",
        "start_date",
        "end_date",
        "all_day",
        "event_type",
        "hours",
      ],
      required: false,
    };
    // Apply filter if eventType query parameter is provided
    if (eventTypeFilter) {
      includeOptions.where = { event_type: eventTypeFilter };
    }

    const dbEmployee = await Employee.findAll({
      attributes: { exclude: ["password"] }, // Exclude sensitive data
      include: [includeOptions],
    });

    res.status(200).json(dbEmployee);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
// Employee login route
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ where: { email } });

    if (!employee) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, employee.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: employee.id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new employee (admin only)
router.post(
  "/",
  [authenticate, isAdmin, validateUserInput],
  async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newEmployee = await Employee.create({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || "employee",
      });
      res.status(201).json({
        message: "Employee created successfully",
        employeeId: newEmployee.id,
      });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Delete an employee (admin only)
router.delete("/:id", [authenticate, isAdmin], async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found.");
    }

    await employee.destroy();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

// Add a new event for an employee (admin only)
router.post(
  "/events/:employeeId",
  [authenticate, isAdmin, validateEventInput], // Ensure to create this middleware for event validation
  async (req, res) => {
    try {
      const { employeeId } = req.params;
      const eventData = req.body; // Contains the data for the new event

      // Verify the employee exists
      const employeeExists = await Employee.findByPk(employeeId);
      if (!employeeExists) {
        return res.status(404).send("Employee not found.");
      }

      // Create a new event associated with the employee
      const newEvent = await Event.create({
        ...eventData,
        employeeId: employeeId, // Ensure this field matches your Event model's foreign key field
      });

      res
        .status(201)
        .json({ message: "Event added successfully", event: newEvent });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send("Internal server error");
    }
  }
);

// Update a schedule event for an employee (admin only)
router.put(
  "/events/:employeeId/:eventId",
  [authenticate, isAdmin, validateEventInput], // Ensure to create this middleware for event validation
  async (req, res) => {
    try {
      const { employeeId, eventId } = req.params;
      const eventUpdateData = req.body; // Contains the updated data for the event

      // Find the employee
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        return res.status(404).send("Employee not found.");
      }

      // Find and update the specific event
      const event = await Event.findOne({
        where: {
          id: eventId,
          // Assuming a column in Event that links to the Employee
          employeeId: employee.id,
        },
      });

      if (!event) {
        return res.status(404).send("Event not found.");
      }

      // Update the event with new data
      await event.update(eventUpdateData);

      res.json({ message: "Event updated successfully", event });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send("Internal server error");
    }
  }
);

// Delete an event for an employee (admin only)
router.delete(
  "/events/:employeeId/:eventId",
  [authenticate, isAdmin],
  async (req, res) => {
    try {
      const { employeeId, eventId } = req.params;

      // Optionally, you can check if the employee exists
      const employeeExists = await Employee.findByPk(employeeId);
      if (!employeeExists) {
        return res.status(404).send("Employee not found.");
      }

      // Find and delete the specific event
      const result = await Event.destroy({
        where: {
          id: eventId,
          employeeId: employeeId, // Assuming a column in Event that links to the Employee
        },
      });

      if (result === 0) {
        return res
          .status(404)
          .send("Event not found or not associated with the given employee.");
      }

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
