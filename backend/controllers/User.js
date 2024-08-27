const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userService = require("../services/userService");

function generateAccessToken(userId) {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign({ userId }, jwtSecret);
}

exports.getRegister = async (req, res, next) => {
  try {
    const { name, mobile, email, dob, gender, address, password } = req.body;
    console.log("USER INFO: ", req.body);

    // Checking if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hashing the password
    const hashedPassword = await userService.hashPassword(password);

    // Generating OTP and its expiration time
    const { otp, otpExpires } = userService.generateOtp();

    // Creating new user
    const newUser = await userService.createUser({
      name,
      mobile,
      email,
      dob,
      gender,
      address,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    // Sending OTP via SMS
    await userService.sendOtpViaSms(mobile, otp);

    // Sending OTP via Email
    await userService.sendOtpViaEmail(email, otp);

    res.status(201).json({
      message:
        "Your details are saved. OTP sent to your registered mobile number. Kindly enter the OTP to confirm your signup.",
      user: newUser,
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not foun" });
    }

    // Verifying the OTP
    const isOtpValid = userService.verifyOtp(user, otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clearing OTP and expiry
    await userService.clearOtp(user);

    res.json({
      message: "Signup successful. You can now log in to your account",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("USER_EMAIL && PASSWORD :", email, password);

  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid Credentials", success: false });
    }

    const passwordMatch = await userService.comparePassword(
      password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email is valid but incorrect password",
        success: false,
      });
    }

    const token = userService.generateAccessToken(user._id);

    return res.status(200).json({
      message: "User Logged In Successfully.",
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    const updatedUser = await userService.updateUserProfile(userId, updateData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error Updating the user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
