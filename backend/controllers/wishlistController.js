import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const populateWishlist = async (userId) => {
  const user = await User.findById(userId).populate("wishlist", "name price image brand rating countInStock");
  if (!user) return null;
  if (!Array.isArray(user.wishlist)) user.wishlist = [];
  return user;
};

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await populateWishlist(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ wishlist: user.wishlist || [] });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!Array.isArray(user.wishlist)) user.wishlist = [];
  const alreadySaved = user.wishlist.some((id) => id.toString() === productId);
  if (!alreadySaved) {
    user.wishlist.push(product._id);
    await user.save();
  }

  const updated = await populateWishlist(req.user._id);
  res.json({ wishlist: updated?.wishlist || [] });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!Array.isArray(user.wishlist)) user.wishlist = [];
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  await user.save();

  const updated = await populateWishlist(req.user._id);
  res.json({ wishlist: updated?.wishlist || [] });
});