import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/productModel.js";

dotenv.config();
connectDB();

const csvPath = path.join(process.cwd(), "data", "products_ready.csv");


const readCSV = () => new Promise((resolve, reject) => {
  const rows = [];
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", () => resolve(rows))
    .on("error", (err) => reject(err));
});

const run = async () => {
  try {
    const rows = await readCSV();
    if (!rows.length) {
      console.log("No rows found in CSV.");
      process.exit();
    }

    // Optional: clear collection
    await Product.deleteMany();

    const docs = rows.map(r => ({
      productId: r.id ? Number(r.id) : undefined,
      name: r.productDisplayName || `Product ${r.id}`,
      brand: r.brand || r.brand,
      description: r.description || r.productDisplayName || "",
      image: r.image || r.link || r.image,
      price: Number(r.price) || Number(r.Price) || 999,
      countInStock: Number(r.countInStock) || Number(r.countinstock) || 10
    }));

    await Product.insertMany(docs);
    console.log(`Imported ${docs.length} products.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
