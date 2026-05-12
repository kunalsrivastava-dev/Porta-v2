import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/request-access", AuthController.requestAccess);
router.get("/check-email", AuthController.checkEmailStatus);

// Protected routes
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
