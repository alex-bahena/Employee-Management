// Import models
const Employee = require("./employee-models/EmployeeModel");
const User = require("./UserModel");
const Skills = require("./employee-models/SkillsModel");
const EmployeeSkills = require("./employee-models/EmployeeSkills");
const EmployeeEvent = require("./employee-models/EmployeeEvent");
const Event = require("./EventModel");

// Define model relationships

// User belongs to Employee
Employee.belongsTo(User, {
  foreignKey: "user_id", // Define foreign key in Employee model
});

// User has one Employee
User.hasOne(Employee, {
  foreignKey: "user_id", // This ensures the foreign key is properly set in the Employee model
});

// Employee belongs to many Skills (through EmployeeSkills)
Employee.belongsToMany(Skills, { through: EmployeeSkills });
// Skills belongs to many Employees (through ProductSkills)
Skills.belongsToMany(Employee, { through: EmployeeSkills });

// Employee belongs to many Events (through EmployeeEvent)
Employee.belongsToMany(Event, { through: EmployeeEvent });
// Event belongs to many Employees (through EmployeeEvent)
Event.belongsToMany(Employee, { through: EmployeeEvent });

module.exports = {
  Employee,
  User,
  Skills,
  Event,
  EmployeeSkills,
  EmployeeEvent,
};
