const express = require("express");
const router = express.Router();
const forgotpasswordController = require("../controllers/ForgotPasswordRequest");
router.post("/forgot-password", forgotpasswordController.handleForgotPassword);
router.get(
  "/forgot-password/resetpassword/:requestId",
  forgotpasswordController.handleresetPassword
);
router.post(
  "/forgot-password/updatepassword/:requestId",
  forgotpasswordController.updatePassword
);
module.exports = router;
