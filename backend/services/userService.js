const User = require("../models/User");
const bcrypt = require("bcrypt");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sendOTPEmail = require("./emailService");

// To Find a user by email
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error("Error finding user by email");
  }
};

//To Hash password
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// To Generate OTP and expiration time
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 15 * 60 * 1000;
  return { otp, otpExpires };
};

// To Create new user
const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error("Error creating user");
  }
};

// To Send OTP via SMS
const sendOtpViaSms = async (mobile, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: mobile,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  } catch (error) {
    throw new Error("Error sending OTP via SMS");
  }
};

//To Send OTP via Email
const sendOtpViaEmail = async (email, otp) => {
  try {
    const sender = {
      email: process.env.ADMIN_USER,
      name: "Abhishek Kumar Gupta",
    };
    const receivers = [{ email }];
    const subject = "OTP Verification";
    const textContent = `Enter the received OTP ${otp} to confirm your signup`;
    const htmlContent = `<h1>OTP Verification</h1><p>Kindly enter the OTP ${otp} to signup successfully.</p>`;
    await sendOTPEmail(sender, receivers, subject, textContent, htmlContent);
  } catch (error) {
    throw new Error("Error sending OTP via email");
  }
};

//To verify OTP
const verifyOtp = (user, otp) => {
  if (user.otp !== otp || Date.now() > user.otpExpires) {
    return false;
  }
  return true;
};

// To Clear OTP and expiry after successful verification
const clearOtp = async (user) => {
  try {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
  } catch (error) {
    throw new Error("Error clearing OTP");
  }
};

// To Compare password
const comparePassword = async (inputPassword, userPassword) => {
  try {
    return await bcrypt.compare(inputPassword, userPassword);
  } catch (error) {
    throw new Error("Error comparing password");
  }
};

//To Generate JWT token

const generateAccessToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    throw new Error("Error generating access token");
  }
};

//To Find a user by ID
const findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error("Error finding user by ID");
  }
};

// To Find a user by ID and update their profile
const updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    //To Manually update each field

    if (updateData.name) user.name = updateData.name;
    if (updateData.gender) user.gender = updateData.gender;
    if (updateData.address) user.address = updateData.address;
    if (updateData.email) user.email = updateData.email;
    if (updateData.dob) user.dob = updateData.dob;
    if (updateData.mobile) user.mobile = updateData.mobile;

    return await user.save();
  } catch (error) {
    throw new Error("Error updating user profile");
  }
};

module.exports = {
  findUserByEmail,
  hashPassword,
  generateOtp,
  createUser,
  sendOtpViaSms,
  sendOtpViaEmail,
  verifyOtp,
  clearOtp,
  comparePassword,
  generateAccessToken,
  findUserById,
  updateUserProfile,
};
