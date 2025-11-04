import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true } // must be unique & non-null
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);
