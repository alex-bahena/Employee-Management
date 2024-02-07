const router = require("express").Router();
const employe_rutes = require("./employee.routes");
const event_routes = require("./event.routes");
const user_routes = require("./user.routes");
const admin_routes = require("./admin.routes");

// Setup routes for employees, events, users and admin
router.use("/employees", employe_rutes);
router.use("/events", event_routes);
router.use("/users", user_routes);
router.use("/admin", admin_routes);

module.exports = router; // Export the API router
