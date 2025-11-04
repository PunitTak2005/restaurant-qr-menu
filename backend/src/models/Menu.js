import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  available: Boolean,
});

export default mongoose.models.Menu || mongoose.model("Menu", menuSchema);
