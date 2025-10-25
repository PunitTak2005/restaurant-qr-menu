import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey1234567890!@#$";


// -----------------------
// PROTECT ROUTES — Verify JWT Token
// -----------------------
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Extract Bearer Token from Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Reject if missing
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "No token, authorization denied" });
    }

    // 3️⃣ Verify Token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Optional: decode printed to verify structure
    // console.log("Decoded token:", decoded);

    // 4️⃣ Fetch user
    const user =
      (await User.findById(decoded.userId || decoded.id).select("-passwordHash")) ||
      null;

    if (!user)
      return res
        .status(401)
        .json({ success: false, error: "User not found or unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message);
    return res
      .status(403)
      .json({ success: false, error: "Invalid or expired token" });
  }
};


// -----------------------
// AUTHORIZE ROLES — RBAC Middleware
// -----------------------
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user)
        return res
          .status(401)
          .json({ success: false, error: "User not found or unauthorized" });

      // Check if role permitted
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: `Role "${req.user.role}" not allowed to access this resource`,
        });
      }

      next();
    } catch (err) {
      console.error("Authorize Error:", err.message);
      res.status(500).json({ success: false, error: "Role authorization failed" });
    }
  };
};
