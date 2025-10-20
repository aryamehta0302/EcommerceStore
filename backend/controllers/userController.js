// backend/controllers/userController.js
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error("User already exists"); }
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id)
  });
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id) });
  } else {
    res.status(401); throw new Error("Invalid email or password");
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses, isAdmin: user.isAdmin, createdAt: user.createdAt });
  else { res.status(404); throw new Error("User not found"); }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  const { name, phone, addresses, password } = req.body;
  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  if (addresses && Array.isArray(addresses)) user.addresses = addresses;
  if (password) user.password = password;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone, addresses: updated.addresses, isAdmin: updated.isAdmin, token: generateToken(updated._id) });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});
