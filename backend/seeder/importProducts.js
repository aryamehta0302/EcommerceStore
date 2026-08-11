import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { seedProductsIfEmpty } from "./bootstrapDemoData.js";

dotenv.config();
await connectDB();

try {
  await seedProductsIfEmpty();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
