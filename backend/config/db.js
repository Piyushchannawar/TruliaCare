import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (err) {
    console.error("\n❌ MongoDB Connection Error:");
    console.error("Could not connect to MongoDB Atlas.");
    console.error("\n📋 To fix this:");
    console.error("1. Go to https://cloud.mongodb.com/");
    console.error("2. Navigate to: Network Access (or Security → Network Access)");
    console.error("3. Click 'Add IP Address'");
    console.error("4. Click 'Add Current IP Address' (or enter 0.0.0.0/0 for all IPs - development only)");
    console.error("5. Wait a few minutes for changes to propagate");
    console.error("\n⚠️  Server will continue running but database operations will fail until connected.\n");
    console.error("Error details:", err.message);
    // Don't exit - let server run but warn about DB issues
    // process.exit(1);
  }
};
