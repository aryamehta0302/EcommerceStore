// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { seedProductsIfEmpty } from "./seeder/bootstrapDemoData.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// static uploads (QR etc)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.get("/", (req, res) => res.send("API running 🚀"));
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);

// error handlers
app.use((err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status);
  res.json({ message: err.message, stack: process.env.NODE_ENV === "production" ? null : err.stack });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const db = await connectDB();

  // Sync demo products from CSV so the storefront has the full catalog in both DB modes.
  await seedProductsIfEmpty();

  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};

startServer();
