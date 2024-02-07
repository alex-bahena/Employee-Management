const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js"); // Import database connection

class Calendar extends Model {}

Calendar.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    start_date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    end_date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    all_day: {
      type: DataTypes.BOOLEAN,
    },
    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "employee",
        key: "id",
      },
    },
    hours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: (calendar, options) => {
        const start = new Date(calendar.start_date);
        const end = new Date(calendar.end_date);
        if (end >= start) {
          calendar.hours = ((end - start) / 3.6e6).toFixed(2);
        } else {
          throw new Error("End date must be after start date");
        }
      },
      beforeUpdate: (calendar, options) => {
        const start = new Date(calendar.start_date);
        const end = new Date(calendar.end_date);
        if (end >= start) {
          calendar.hours = ((end - start) / 3.6e6).toFixed(2);
        } else {
          throw new Error("End date must be after start date");
        }
      },
    },

    sequelize, // Database connection instance
    timestamps: false, // No timestamps
    freezeTableName: true, // Prevent Sequelize from renaming the table
    underscored: true, // Use underscores instead of camelCasing
    modelName: "calendar", // Name of the model
  }
);

module.exports = Calendar;
