const jwt = require("jsonwebtoken");
const User = require("../database/models/userModel");

module.exports.validateToken = async (req, res, next) => {
  // Vérifier si l'en-tête d'autorisation est présent
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Access Denied" });
  }

  // Extraire le token de l'en-tête d'autorisation
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split("Bearer ")[1].trim();
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    // Vérifier et décoder le token
    const verified = jwt.verify(
      token,
      process.env.SECRET_KEY || "default-secret-key"
    );
    req.user = verified;

    // Récupérer l'utilisateur et vérifier son rôle
    const user = await User.findById(verified.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userRole = user.role; // Stocker le rôle de l'utilisateur dans req
    req.userId = user._id; // Stocker l'ID de l'utilisateur dans req

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Middleware pour vérifier le rôle d'admin
module.exports.requireAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Access Denied: Admins only" });
  }
  next();
};
