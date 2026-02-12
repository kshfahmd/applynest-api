const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const rawVerificationToken = crypto.randomBytes(32).toString("hex");
    console.log("Verification token:", rawVerificationToken);

    const verificationToken = crypto
      .createHash("sha256")
      .update(rawVerificationToken)
      .digest("hex");

    const verificationTokenExpires = Date.now() + 60 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server eroor", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified succesfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const rawResetToken = crypto.randomBytes(32).toString("hex");

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawResetToken)
      .digest("hex");

    const resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;

    await user.save();

    console.log("Reset token:", rawResetToken);

    res.status(200).json({
      message: "Password reset token generated. Check your email.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
