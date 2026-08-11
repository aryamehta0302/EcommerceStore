// backend/routes/orderRoutes.js
import express from "express";
import { addOrder, getOrderById, getMyOrders, getOrders, updateOrderToDelivered, updateOrderStatus } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", protect, addOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
router.put("/:id/status", protect, admin, updateOrderStatus);
export default router;
