require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/UserModel"); // User model
const sequelize = require("../config/connection"); // Sequelize connection

const createSuperAdminUser = async () => {
  try {
    // Check if super admin users already exist
    const admin1Exists = await User.findOne({
      where: { email: process.env.DB_SUPER_ADMIN_USER1 },
    });
    const admin2Exists = await User.findOne({
      where: { email: process.env.DB_SUPER_ADMIN_USER2 },
    });

    if (!admin1Exists) {
      const hashedPassword1 = await bcrypt.hash(process.env.DB_ADMIN_PWD1, 10);
      await User.create({
        email: process.env.DB_SUPER_ADMIN_USER1,
        password: hashedPassword1,
        role: "super_admin",
      });
      console.log("First super admin user created successfully");
    }

    if (!admin2Exists) {
      const hashedPassword2 = await bcrypt.hash(process.env.DB_ADMIN_PWD2, 10);
      await User.create({
        email: process.env.DB_SUPER_ADMIN_USER2,
        password: hashedPassword2,
        role: "super_admin",
      });
      console.log("Second super admin user created successfully");
    }
  } catch (error) {
    console.error("Error creating super admin users:", error);
  }
};

if (require.main === module) {
  sequelize.sync({ force: false }).then(async () => {
    await createSuperAdminUser();
    process.exit(0);
  });
}
