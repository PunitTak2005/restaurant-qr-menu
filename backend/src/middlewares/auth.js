import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET not defined in .env');
  process.exit(1); // Stop server if secret is missing
}

// ========================
// Protect routes middleware
// ========================
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'Unauthorized: Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id || !decoded.role) {
      return res.status(401).json({ error: 'Token payload invalid' });
    }

    req.user = decoded; // Attach { id, role } to request
    next();
  } catch (err) {
    console.error('JWT error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ========================
// Role-based authorization
// ========================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user attached' });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: `Forbidden: Role "${req.user.role}" not allowed` });
    }

    next();
  };
};
