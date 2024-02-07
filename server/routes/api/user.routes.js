const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../../models/UserModel");
const authenticate = require("../middleware/authenticate");
const isAdmin = require("../middleware/isAdmin");
const validateUserInput = require("../middleware/validateUserInput");
const rateLimit = require("express-rate-limit"); // Rate limiting middleware

// Apply rate limiting to login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Get all users (admin only)
router.get("/", [authenticate, isAdmin], async (req, res) => {
  try {
    const dbUser = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclude sensitive data
    });
    res.status(200).json(dbUser);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login route
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new user (admin only)
router.post(
  "/",
  [authenticate, isAdmin, validateUserInput],
  async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role || "user",
      });
      res
        .status(201)
        .json({ message: "User created successfully", userId: newUser.id });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Update a user (admin only)
router.put(
  "/:id",
  [authenticate, isAdmin, validateUserInput],
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).send("User not found.");
      }

      // Controlled update of user details
      if (req.body.email) user.email = req.body.email;
      if (req.body.role) user.role = req.body.role;

      await user.save();
      res.json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Delete a user (admin only)
router.delete("/:id", [authenticate, isAdmin], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
