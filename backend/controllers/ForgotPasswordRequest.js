const User = require("../models/User");
const bcrypt = require("bcrypt");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");

const { sendOTPEmail: sendResetEmail } = require("../services/emailService");

exports.handleForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Checking if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Checking if there is already an active request for the user
    const existingRequest = await ForgotPasswordRequest.findOne({
      userId: user._id,
      isactive: true,
    });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "There is already an active password reset request for this user.",
      });
    }

    // Creating a new forgot password request
    const forgotPasswordRequest = new ForgotPasswordRequest({
      userId: user._id,
      isactive: true,
    });

    await forgotPasswordRequest.save();

    // Building the reset link
    const resetLink = `http://localhost:5000/api/forgot-password/resetpassword/${forgotPasswordRequest._id}`;

    // Sending the reset email
    const sender = {
      email: process.env.EMAIL_USER,
      name: "Abhishek Kumar Gupta",
    };

    const receivers = [{ email: email }];

    const subject = "Password Reset";
    const textContent = `Click the link below to reset your password: ${resetLink}`;
    const htmlContent = `<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`;

    await sendResetEmail(sender, receivers, subject, textContent, htmlContent);

    res.status(200).json({
      message:
        "Password reset email sent successfully, check your email please",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.handleresetPassword = async (req, res, next) => {
  try {
    const requestId = req.params.requestId;

    // Checking if the request exists and is active
    const resetRequest = await ForgotPasswordRequest.findOne({
      _id: requestId,
      isactive: true,
    });

    if (!resetRequest) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }

    res.send(`
      <form action="http://localhost:5000/api/forgot-password/updatepassword/${requestId}" method="POST">
        <label for="password">Enter a new password:</label>
        <input type="password" name="password" required>
        <button type="submit">Update Password</button>
      </form>
    `);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const requestId = req.params.requestId;
    const newPassword = req.body.password;

    // Checking if the request exists and is active
    const resetRequest = await ForgotPasswordRequest.findOne({
      _id: requestId,
      isactive: true,
    });

    if (!resetRequest) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }

    // Updating the user's password
    const user = await User.findById(resetRequest.userId);

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Deactivating the reset request
    resetRequest.isactive = false;
    await resetRequest.save();

    return res.status(200).send("<h1>Password updated successfully</h1>");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
