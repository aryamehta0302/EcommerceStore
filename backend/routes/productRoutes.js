// backend/routes/productRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productController.js";

const router = express.Router();


router
  .route("/")
  .get(
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
  )
  .post(protect, admin, createProduct);


router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if (product) res.json(product);
      else res.status(404).json({ message: "Product not found" });
    })
  )
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.post("/:id/reviews", protect, createProductReview);

export default router;