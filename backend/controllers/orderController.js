// backend/controllers/orderController.js
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const addOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) { res.status(400); throw new Error("No order items"); }
  const order = new Order({ user: req.user._id, orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, estimatedDelivery: new Date(Date.now() + (Number(process.env.EST_DELIVERY_DAYS || 5) * 86400000)) });
  const created = await order.save();
  for (const item of orderItems) {
    if (item.product) await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } });
  }
  res.status(201).json(created);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) { res.status(404); throw new Error("Order not found"); }
  res.json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name email").sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  order.isDelivered = true; order.deliveredAt = Date.now();
  const updated = await order.save();
  res.json(updated);
});

const STATUS_FLOW = ["pending", "processing", "shipped", "out_for_delivery", "delivered"];

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!STATUS_FLOW.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  order.status = status;
  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  } else {
    order.isDelivered = false;
    order.deliveredAt = undefined;
  }
  const updated = await order.save();
  res.json(updated);
});