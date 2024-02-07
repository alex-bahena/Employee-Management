// Load and use environment variables from a .env file
require("dotenv").config();

// Import Sequelize constructor from the sequelize package
const { Sequelize } = require("sequelize");

// Create a Sequelize instance for connecting to the database
const sequelize = process.env.JAWSDB_URL
  ? // If JAWSDB_URL is available (usually in a production environment), use it to connect to the database
    new Sequelize(process.env.JAWSDB_URL)
  : // Otherwise, use local database credentials for connection
    new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: "localhost", // Database host (local)
      dialect: "mysql", // Database dialect (MySQL)
      dialectOptions: {
        decimalNumbers: true, // Ensure numbers are stored with decimal precision
      },
    });

// Test the database connection
sequelize
  .authenticate() // Authenticate the connection
  .then(() => console.log("Database connected.")) // Log success message
  .catch((err) => console.error("Unable to connect to the database:", err)); // Log any errors

module.exports = sequelize; // Export the Sequelize connection instance
