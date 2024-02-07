const { Model, DataTypes } = require("sequelize"); // Import Sequelize library components
const sequelize = require("../../config/connection"); // Import database connection

// Initialize Skills model by extending Sequelize's Model class
class Skills extends Model {}

// Define schema for Skills model
Skills.init(
  {
    // Define columns in Skills table
    id: {
      type: DataTypes.INTEGER, // Integer type
      allowNull: false, // Non-nullable
      primaryKey: true, // Primary Key
      autoIncrement: true, // Auto-incrementing
    },
    skills_name: {
      type: DataTypes.STRING, // String type
      allowNull: false, // Non-nullable
    },
  },
  {
    sequelize, // Database connection instance
    timestamps: false, // No timestamps
    freezeTableName: true, // Prevent Sequelize from renaming the table
    underscored: true, // Use underscores instead of camelCasing
    modelName: "skills", // Name of the model
  }
);

module.exports = Skills; // Export the Skills model
