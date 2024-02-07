const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");
const Employee = require("../models/employee-models/EmployeeModel"); // Adjust the path according to your project structure

class User extends Model {}

User.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    // Model attributes
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user", // Default role is 'user'
      validate: {
        isIn: [["user", "admin", "super_admin"]], // Allowable values are 'user','admin' 'super_admin'
      },
    },
  },
  {
    sequelize,
    timestamps: true, // Enable timestamps
    underscored: true, // Use snake_case instead of camelCase for the database attributes
    modelName: "users", // Model name used in sequelize
    paranoid: true, // Enable soft deletes (won't actually delete entries but set a deletedAt timestamp)
    createdAt: "created_at", // Custom column name for createdAt
    updatedAt: "updated_at", // Custom column name for updatedAt
    deletedAt: "deleted_at", // Custom column name for deletedAt if paranoid is true
  }
);

module.exports = User;
