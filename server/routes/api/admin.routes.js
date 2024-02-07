const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../../models/UserModel");
const authenticate = require("../middleware/authenticate");
const isSuperAdmin = require("../middleware/isSuperAdmin");
const validateUserInput = require("../middleware/validateUserInput");

//Login is the same for users.

// Create a new admin user (super_admin only)
router.post(
  "/admin",
  [authenticate, isSuperAdmin, validateUserInput],
  async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        email: req.body.email,
        password: hashedPassword,
        role: "admin", // Explicitly setting the role to 'admin'
      });
      res.status(201).json({
        message: "Admin user created successfully",
        userId: newUser.id,
      });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// Delete an admin user (super_admin only)
router.delete("/admin/:id", [authenticate, isSuperAdmin], async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Check if the user being deleted is an admin
    if (user.role !== "admin") {
      return res.status(403).send("Only admin users can be deleted.");
    }

    // Proceed to delete the admin user
    await user.destroy();
    res.json({ message: "Admin user deleted successfully" });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
