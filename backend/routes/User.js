const express = require("express");
const router = express.Router();
const userController = require("../controllers/User");

router.post("/user/signup", userController.getRegister);
router.post("/verify-otp", userController.verifyOtp);
module.exports = router;
