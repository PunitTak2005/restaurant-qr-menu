import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ---------------- CONFIG ----------------
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey1234567890!@#$";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// Token generator
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, error: "All fields (name, email, password) are required" });

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ success: false, error: "Email already registered" });

    // Pass plain password; pre('save') hook will hash
    const newUser = new User({
      name,
      email: normalizedEmail,
      passwordHash: password,
      role: role?.toLowerCase() || "customer",
    });

    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, error: "Server error during registration" });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: "Email & password required" });

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.status(401).json({ success: false, error: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, error: "Invalid credentials (password mismatch)" });

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, error: "Server error during login" });
  }
};

// ---------------- GET CURRENT USER ----------------
export const getMe = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user, // Populated by auth middleware after JWT verification
    });
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch user details" });
  }
};
