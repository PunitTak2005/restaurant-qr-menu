import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET not defined in .env');
  process.exit(1);
}

// ========================
// Main Auth Middleware (Protect)
// ========================
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided or malformed' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Prefer userId field for compatibility
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token payload (no user id)' });
    }

    // Load user from DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach safe user info to req for access in routes
    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      // Add more fields if needed
    };

    next();
  } catch (err) {
    console.error('JWT Auth Error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;

// ========================
// Role-based authorization
// ========================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user attached' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Role "${req.user.role}" not allowed` });
    }
    next();
  };
};
