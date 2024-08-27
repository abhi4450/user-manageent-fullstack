const forgotPasswordService = require("../services/forgotPasswordService");

exports.handleForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Checking if user exists
    const user = await forgotPasswordService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Checking if there is already an active request for the user
    const existingRequest = await forgotPasswordService.findActiveResetRequest(
      user._id
    );
    if (existingRequest) {
      return res.status(400).json({
        message:
          "There is already an active password reset request for this user.",
      });
    }

    // Creating a new forgot password request
    const forgotPasswordRequest =
      await forgotPasswordService.createResetRequest(user._id);

    // Building the reset link
    const resetLink = `https://user-management-fullstack.onrender.com/api/forgot-password/resetpassword/${forgotPasswordRequest._id}`;

    // Sending the reset email using the service function
    await forgotPasswordService.sendPasswordResetEmail(email, resetLink);

    res.status(200).json({
      message:
        "Password reset email sent successfully, check your email please",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.handleResetPassword = async (req, res, next) => {
  try {
    const requestId = req.params.requestId;

    const resetRequest = await forgotPasswordService.findResetRequestById(
      requestId
    );
    if (!resetRequest) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }

    res.send(`
      <form action="https://user-management-fullstack.onrender.com/api/forgot-password/updatepassword/${requestId}" method="POST">
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

    const resetRequest = await forgotPasswordService.findResetRequestById(
      requestId
    );
    if (!resetRequest) {
      return res.status(404).json({ message: "Invalid or expired reset link" });
    }

    await forgotPasswordService.updateUserPassword(
      resetRequest.userId,
      newPassword
    );
    await forgotPasswordService.deactivateResetRequest(requestId);

    return res.status(200).send("<h1>Password updated successfully</h1>");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
