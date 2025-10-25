import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`Database name: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message || error}`);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
