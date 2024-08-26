const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");
const userAuth = require("../middlewares/Auth");

router.post("/user/signup", userController.getRegister);
router.post("/verify-otp", userController.verifyOtp);
router.post("/user/login", userController.loginUser);
router.get(
  "/user/profile",
  userAuth.authenticate,
  userController.getUserProfile
);
module.exports = router;
