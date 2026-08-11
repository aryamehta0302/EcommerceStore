// backend/routes/productRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { protect } from "../middleware/authMiddleware.js";
import { createProductReview } from "../controllers/productController.js";

const router = express.Router();

// ✅ Get all (with search)
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 20;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { brand: { $regex: req.query.keyword, $options: "i" } },
            { category: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// ✅ Get product by ID
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  })
);

// @desc Create a new review
// @route POST /api/products/:id/reviews
// @access Private (must be logged in — uses req.user for name)
router.post("/:id/reviews", protect, createProductReview);

export default router;