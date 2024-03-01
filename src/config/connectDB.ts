import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongodb_url = process.env.MONGO_URL;
    if (!mongodb_url) {
      console.error("MongoDB connection URL is not provided.");
      process.exit(1);
    } else {
      await mongoose.connect(mongodb_url, {});
      console.log("MongoDB connected successfully");
    }
  } catch (error) {
    console.error(`Error from MongoDB: ${error}`);
    process.exit(1);
  }
};
