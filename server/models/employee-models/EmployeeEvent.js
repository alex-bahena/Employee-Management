const { Model, DataTypes } = require("sequelize"); // Import Sequelize library components
const sequelize = require("../../config/connection"); // Import database connection

// Define EmployeeEvent class extending Sequelize Model
class EmployeeEvent extends Model {}

// Initialize EmployeeEvent model with schema definition
EmployeeEvent.init(
  {
    // Define columns in EmployeeEvent table
    id: {
      type: DataTypes.INTEGER, // Column type
      allowNull: false, // Non-nullable
      primaryKey: true, // Primary Key
      autoIncrement: true, // Auto-incrementing
    },
    employee_id: {
      type: DataTypes.INTEGER, // Column type for employee ID
      references: {
        // Foreign Key reference
        model: "employee", // Reference to employee model
        key: "id", // Key in employee model to reference
      },
    },
    event_id: {
      type: DataTypes.INTEGER, // Column type for skills ID
      references: {
        // Foreign Key reference
        model: "event", // Reference to skills model
        key: "id", // Key in skills model to reference
      },
    },
  },
  {
    sequelize, // Database connection instance
    timestamps: false, // No timestamps
    freezeTableName: true, // Prevent Sequelize from renaming the table
    underscored: true, // Use underscores instead of camelCasing
    modelName: "employee_skills", // Name of the model
  }
);

module.exports = EmployeeEvent; // Export the EmployeeEvent model
