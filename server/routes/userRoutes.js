const express = require("express");
const userController = require("../controllers/userController");
const tokenValidation = require("../middleware/tokenValidation");

const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);
router.get(
  "/profile",
  tokenValidation.validateToken,
  userController.getUserProfile
);
router.put(
  "/profile",
  tokenValidation.validateToken,
  userController.updateUserProfile
);
router.get("/", userController.getAllUsers);

module.exports = router;
