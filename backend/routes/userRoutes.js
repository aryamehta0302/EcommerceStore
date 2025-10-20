// backend/routes/userRoutes.js
import express from "express";
import { registerUser, authUser, getUserProfile, updateUserProfile, getUsers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/", protect, admin, getUsers);
export default router;
