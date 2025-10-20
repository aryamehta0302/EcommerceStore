// backend/routes/orderRoutes.js
import express from "express";
import { addOrder, getOrderById, getMyOrders, getOrders, updateOrderToDelivered } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", protect, addOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
export default router;
