import express from "express";
import { UserController } from "../controllers/UserController.js";
import { authMiddleware, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes - all require authentication
router.use(authMiddleware);

// Get current user profile
router.get("/me", UserController.getCurrentUser);

// Admin-only routes
router.get("/", authorize(["ADMIN"]), UserController.getAllUsers);
router.get("/:userId", authorize(["ADMIN"]), UserController.getUserById);
router.patch("/:userId/role", authorize(["ADMIN"]), UserController.updateUserRole);
router.patch("/:userId/permissions", authorize(["ADMIN"]), UserController.updateUserPermissions);
router.patch("/:userId/status", authorize(["ADMIN"]), UserController.toggleUserStatus);
router.delete("/:userId", authorize(["ADMIN"]), UserController.deleteUser);
router.get("/dashboard/stats", authorize(["ADMIN"]), UserController.getDashboardStats);

export default router;
