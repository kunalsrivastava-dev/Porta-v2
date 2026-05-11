import mongoose from "mongoose";

export const connectDB = async (retries = 5): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/porta";
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log("✓ MongoDB connected successfully");
      return;
    } catch (error) {
      console.error(`✗ MongoDB connection attempt ${attempt}/${retries} failed:`, (error as Error).message);
      if (attempt === retries) {
        console.error("✗ All MongoDB connection attempts failed. Exiting.");
        process.exit(1);
      }
      console.log(`  Retrying in 3 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("✓ MongoDB disconnected");
  } catch (error) {
    console.error("✗ MongoDB disconnection failed:", error);
  }
};
