import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// -----------------------------
// USER SCHEMA
// -----------------------------
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Optional Regex for email validation (recommended for future):
      // match: [/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/, "Please use a valid email address"]
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "customer", "owner", "restaurant-owner"],
      default: "customer",
    },
  },
  { timestamps: true }
);

// -----------------------------
// PRE-SAVE — Hash before saving exactly once
// -----------------------------
userSchema.pre("save", async function (next) {
  // Only hash if field is set OR document is new
  if (!this.isModified("passwordHash")) return next();
  // If a plain password is provided (not already hashed), hash it now
  if (
    this.passwordHash &&
    !/^\$2[aby]\$/.test(this.passwordHash) // checks for bcrypt hash format
  ) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

// -----------------------------
// METHOD — Compare entered vs stored hash
// -----------------------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// -----------------------------
// EXPORT MODEL
// -----------------------------
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
