const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).send("Access denied.");
  }
  next();
};

module.exports = isAdmin;
