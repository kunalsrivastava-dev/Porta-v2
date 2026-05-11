import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import User from "./src/models/User.js";

dotenv.config();

const checkUsers = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/porta";
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");
    
    const users = await User.find({}, 'email role isApproved');
    console.log("Users in DB:", users);
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkUsers();
