import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import Product from "../models/productModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.resolve(__dirname, "..", "data", "products_ready.csv");

const readCSV = () => new Promise((resolve, reject) => {
  const rows = [];
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (data) => rows.push(data))
    .on("end", () => resolve(rows))
    .on("error", (err) => reject(err));
});

export const seedProductsIfEmpty = async () => {
  const count = await Product.countDocuments();
  const rows = await readCSV();
  if (!rows.length) {
    return;
  }

  const docs = rows.map((row) => ({
    productId: row.id ? Number(row.id) : undefined,
    name: row.productDisplayName || `Product ${row.id}`,
    gender: row.gender || "",
    category: row.masterCategory || "",
    subCategory: row.subCategory || "",
    articleType: row.articleType || "",
    baseColour: row.baseColour || "",
    season: row.season || "",
    year: row.year ? Number(row.year) : undefined,
    usage: row.usage || "",
    brand: row.brand || "",
    description: row.description || row.productDisplayName || "",
    image: row.image || row.link || "",
    price: Number(row.price) || Number(row.Price) || 999,
    countInStock: Number(row.countInStock) || Number(row.countinstock) || 10,
    rating: Number(row.rating) || 0,
    numReviews: Number(row.numReviews) || 0,
  }));

  if (count === 0) {
    await Product.insertMany(docs);
    console.log(`Imported ${docs.length} demo products.`);
    return;
  }

  const existingCount = count;
  if (existingCount < docs.length) {
    await Product.bulkWrite(
      docs.map((doc) => ({
        updateOne: {
          filter: { productId: doc.productId },
          update: { $set: doc },
          upsert: true,
        },
      }))
    );
    console.log(`Synced ${docs.length} products from CSV.`);
  }
};