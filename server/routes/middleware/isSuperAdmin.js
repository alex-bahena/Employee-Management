const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res
      .status(403)
      .send("Access denied. Only super admins are allowed.");
  }
  next();
};

module.exports = isSuperAdmin;
