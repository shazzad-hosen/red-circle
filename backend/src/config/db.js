import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(ENV.DB_URL);
    console.log("Connected to the Database", connect.connection.host);
  } catch (error) {
    console.log("Error Connecting the Database", error);
    process.exit(1);
  }
};
