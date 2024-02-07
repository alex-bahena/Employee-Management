const express = require("express"); // Import Express.js library for server functionality
const routes = require("./routes"); // Import routes from the routes directory
const morgan = require("morgan"); // Import Morgan for HTTP request logging
// Import Sequelize configuration for database connection
const sequelize = require("./config/connection");

const app = express(); // Initialize an Express application
const PORT = process.env.PORT || 3001; // Define server port

// Middleware for logging HTTP requests in development mode
app.use(morgan("dev"));
// Middleware for parsing JSON bodies in requests
app.use(express.json());
// Middleware for parsing URL-encoded bodies in requests
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

// Apply imported routes to the Express application
app.use(routes);

// Sync Sequelize models to the database, then start the server
sequelize.sync({ force: false }).then(() => {
  // Listen on defined PORT and log when server is running
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
