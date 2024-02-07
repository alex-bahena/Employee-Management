const { Model, DataTypes } = require("sequelize"); // Import Sequelize library components
const sequelize = require("../../config/connection"); // Import database connection

// Define EmployeeSkills class extending Sequelize Model
class EmployeeSkills extends Model {}

// Initialize EmployeeSkills model with schema definition
EmployeeSkills.init(
  {
    // Define columns in EmployeeSkills table
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
    skills_id: {
      type: DataTypes.INTEGER, // Column type for skills ID
      references: {
        // Foreign Key reference
        model: "skills", // Reference to skills model
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

module.exports = EmployeeSkills; // Export the EmployeeSkills model
