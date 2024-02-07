const { Model, DataTypes } = require("sequelize"); // Import Sequelize library components
const sequelize = require("../../config/connection"); // Import database connection
// Initialize Employee model by extending Sequelize's Model class
class Employee extends Model {}

Employee.init(
  {
    // Define columns in Employee table
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fullname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    employment_type: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.BIGINT, // Data type matching the 'id' in the User model
      allowNull: false,
      references: {
        model: "users", // User's table
        key: "id",
      },
    },
    manager_id: {
      type: DataTypes.BIGINT,
      allowNull: true, // This allows employees without a manager
      references: {
        model: "employee",
        key: "id",
      },
    },
    weekhrs: {
      allowNull: true,
      type: DataTypes.DOUBLE,
    },
    active: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
  },
  {
    hooks: {
      beforeCreate: async (employee, options, cb) => {
        return new Promise((resolve, reject) => {
          employee.fullname = employee.name + " " + employee.surname;

          return resolve(employee, options);
        });
      },
      beforeUpdate: async (employee, options) => {
        return new Promise((resolve, reject) => {
          employee.fullname = employee.name + " " + employee.surname;

          return resolve(employee, options);
        });
      },
    },
    sequelize, // Database connection instance
    timestamps: true, // Timestamps
    freezeTableName: true, // Prevent Sequelize from renaming the table
    underscored: true, // Use underscores instead of camelCasing
    modelName: "employee", // Name of the model
  }
);
// Self-referencing association for Manager
Employee.belongsTo(Employee, { as: "Manager", foreignKey: "manager_id" });
// Define the User association
module.exports = Employee; // Export the Employee model
