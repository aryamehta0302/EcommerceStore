import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  rating: Number,
  comment: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  productId: Number,
  name: { type: String, required: true },
  gender: String,
  category: String,
  subCategory: String,
  articleType: String,
  baseColour: String,
  season: String,
  year: Number,
  usage: String,
  brand: String,
  description: String,
  image: String,
  price: { type: Number, default: 0 },
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
