import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

dotenv.config();
const router = express.Router();

// ------------------------------
// Token generator utility
// ------------------------------
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "supersecretkey1234567890!@#$",
    { expiresIn: "7d" }
  );
};

// ===========================================================================
// CONTROLLER-BASED CORE AUTH ROUTES
// ===========================================================================
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

// ===========================================================================
// INLINE EXTENSIONS (Optional Demonstrations or Extended Functionalities)
// ===========================================================================

// ---------------- REGISTER (ALT) ----------------
// Allows separate endpoint for direct creation without using controller
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: role?.toLowerCase() || "customer",
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
});

// ---------------- LOGIN (ALT) ----------------
// Mirrors controller logic; helpful for custom testing
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required." });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

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
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
});

// ---------------- Protected GET /me ----------------
router.get("/me-inline", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get /me Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch user data",
    });
  }
});

// ---------------- ADMIN DASHBOARD (Role-based Access) ----------------
router.get("/admin-dashboard", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome Admin, ${req.user.name}!`,
  });
});

export default router;
