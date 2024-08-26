const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../services/emailService");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

function generateAccessToken(userId) {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign({ userId }, jwtSecret);
}

exports.getRegister = async (req, res, next) => {
  try {
    const { name, mobile, email, dob, gender, address, password } = req.body;
    console.log("USER INFO: ", req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 15 * 60 * 1000;

    const newUser = new User({
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
    await newUser.save();
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      to: `'${mobile}'`,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    const sender = {
      email: process.env.EMAIL_USER,
      name: "Ahishek Kumar Gupta",
    };
    const receivers = [{ email: email }];

    const subject = "OTP verification";
    const textContent = `Enter the received OTP ${otp} to confirm your singup`;
    const htmlContent = `<h1>OTP verification</h1><p>kindly enter the ${otp} to signup successfully.</p>`;
    await sendOTPEmail(sender, receivers, subject, textContent, htmlContent);
    res.status(201).json({
      message:
        "Your details are saved.Otp sent to your registered mobile number.Kindly enter the otp to confirm your signup.",
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not foun" });
    }

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({
      message: "Signup successful.You can now login to your account",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("USER_EMAIL && PASSWORD :", email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid Credentials", success: false });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email is valid but incorrect password",
        success: false,
      });
    }

    const token = generateAccessToken(user._id);

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
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
