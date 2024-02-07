// EventModel.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");

class Event extends Model {}

Event.init(
  {
    // Unique identifier for the event
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.BIGINT,
    },
    // Title or name of the event
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Detailed description of the event
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Days of the week when the event occurs
    days: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("days");
        return rawValue ? rawValue.split(",") : [];
      },
      set(value) {
        this.setDataValue(
          "days",
          Array.isArray(value) ? value.join(",") : value
        );
      },
    },
    // Start date and time of the event
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // End date and time of the event
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Indicates if the event is an all-day event
    all_day: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Type of event, defined manually by the admin
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Number of hours associated with the event
    hours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
  },
  {
    hooks: {
      beforeCreate: (event, options) => {
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);
        if (end >= start) {
          event.hours = ((end - start) / 3.6e6).toFixed(2);
        } else {
          throw new Error("End date must be after start date");
        }
      },
      beforeUpdate: (event, options) => {
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);
        if (end >= start) {
          event.hours = ((end - start) / 3.6e6).toFixed(2);
        } else {
          throw new Error("End date must be after start date");
        }
      },
    },
    sequelize,
    modelName: "event",
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

module.exports = Event;
