// backend/config/db.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;

  try {
    if (!mongoUri) {
      throw new Error("Missing MongoDB connection string. Set MONGO_URI in backend/.env (or MONGODB_URI/MONGO_URL).");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return { connection: conn, usingMemoryServer: false };
  } catch (err) {
    console.warn(`MongoDB connection failed (${err.message}). Starting in-memory MongoDB fallback...`);

    if (!memoryServer) {
      memoryServer = await MongoMemoryServer.create();
    }

    const memoryUri = memoryServer.getUri("ecommerce");
    const conn = await mongoose.connect(memoryUri);
    console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
    return { connection: conn, usingMemoryServer: true };
  }
};

export default connectDB;
