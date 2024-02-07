const router = require("express").Router(); // Import Express Router
const api_routes = require("./api"); // Import API routes

// Use API routes when the URL starts with '/api'
router.use("/api", api_routes);

// Fallback route for any other request not handled by API routes
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>");
});

module.exports = router; // Export the configured router
