import express from "express";
import Product from "../models/productModel.js";
const router = express.Router();

// simple read route
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
