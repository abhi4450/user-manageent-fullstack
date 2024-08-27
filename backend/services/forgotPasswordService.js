const User = require("../models/User");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const { sendOTPEmail: sendResetEmail } = require("./emailService");
const bcrypt = require("bcrypt");

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.findActiveResetRequest = async (userId) => {
  return await ForgotPasswordRequest.findOne({
    userId: userId,
    isactive: true,
  });
};

exports.createResetRequest = async (userId) => {
  const resetRequest = new ForgotPasswordRequest({
    userId: userId,
    isactive: true,
  });
  return await resetRequest.save();
};

exports.findResetRequestById = async (requestId) => {
  return await ForgotPasswordRequest.findOne({
    _id: requestId,
    isactive: true,
  });
};

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.updateUserPassword = async (userId, newPassword) => {
  const hashedPassword = await this.hashPassword(newPassword);
  return await User.findByIdAndUpdate(userId, { password: hashedPassword });
};

exports.deactivateResetRequest = async (requestId) => {
  return await ForgotPasswordRequest.findByIdAndUpdate(requestId, {
    isactive: false,
  });
};

exports.sendPasswordResetEmail = async (email, resetLink) => {
  const sender = {
    email: process.env.ADMIN_USER,
    name: "Abhishek Kumar Gupta",
  };
  const receivers = [{ email }];
  const subject = "Password Reset";
  const textContent = `Click the link below to reset your password: ${resetLink}`;
  const htmlContent = `<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`;

  return await sendResetEmail(
    sender,
    receivers,
    subject,
    textContent,
    htmlContent
  );
};
