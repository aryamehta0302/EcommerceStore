// backend/models/orderModel.js
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  qty: Number,
  price: Number,
  image: String,
  size: String   // ← added: persists the selected size/shoe size/"One Size" on each order line
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String
  },
  paymentMethod: String,
  paymentResult: Object,
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "out_for_delivery", "delivered"],
    default: "pending"
  },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  estimatedDelivery: Date
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;