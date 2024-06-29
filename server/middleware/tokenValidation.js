const jwt = require("jsonwebtoken");
const User = require("../database/models/userModel");

module.exports.validateToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = req.headers.authorization.split("Bearer ")[1].trim();
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.SECRET_KEY || "default-secret-key"
    );
    req.user = verified;

    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports.requireAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins only" });
  }
  next();
};
