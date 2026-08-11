// backend/controllers/productController.js
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// pagination & filters
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};
  const min = req.query.min ? { price: { $gte: Number(req.query.min) } } : {};
  const max = req.query.max ? { price: { $lte: Number(req.query.max) } } : {};
  const filter = { ...keyword, ...brand, ...min, ...max };
  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter).skip(pageSize * (page - 1)).limit(pageSize).sort({ createdAt: -1 });
  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

export const getProductById = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (p) res.json(p); else { res.status(404); throw new Error("Product not found"); }
});

export const createProduct = asyncHandler(async (req, res) => {
  const p = new Product({ name: "New Product", brand: "", description: "", price: 0, countInStock: 0, image: "" });
  const created = await p.save();
  res.status(201).json(created);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  const { name, brand, description, price, countInStock, image } = req.body;
  product.name = name ?? product.name;
  product.brand = brand ?? product.brand;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.countInStock = countInStock ?? product.countInStock;
  product.image = image ?? product.image;
  const updated = await product.save();
  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) { await product.remove(); res.json({ message: "Product removed" }); } else { res.status(404); throw new Error("Product not found"); }
});
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const already = product.reviews.find(
    (r) => r.user && r.user.toString() === req.user._id.toString()
  );
  if (already) {
    res.status(400);
    throw new Error("Product already reviewed by this user");
  }

  const review = {
    user: req.user._id,
    name: req.user.name || req.user.email,
    rating: Number(rating),
    comment,
  };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});