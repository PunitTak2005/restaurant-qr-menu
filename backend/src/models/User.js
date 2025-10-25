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
