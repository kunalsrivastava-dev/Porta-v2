import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { AuthService } from "../services/AuthService.js";
import { AccessRequestService } from "../services/AccessRequestService.js";
import { validateRequestBody } from "../utils/validators.js";

export class AuthController {
  // Register pre-approved user
  static async register(req: AuthRequest, res: Response) {
    try {
      const { email, name, password } = req.body;

      const validation = validateRequestBody(
        req.body,
        ["email", "name", "password"]
      );
      if (!validation.valid) {
        return res.status(400).json({ success: false, message: validation.error });
      }

      const result = await AuthService.registerApprovedUser(email, name, password);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  // Verify email for invite-only flow
  static async verifyEmail(req: AuthRequest, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await AuthService.verifyEmailStatus(email);
      
      return res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Verification failed",
      });
    }
  }

  // Login
  static async login(req: AuthRequest, res: Response) {
    try {
      const { email, password } = req.body;

      const validation = validateRequestBody(req.body, ["email", "password"]);
      if (!validation.valid) {
        return res.status(400).json({ success: false, message: validation.error });
      }

      const result = await AuthService.login(email, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  // Request access
  static async requestAccess(req: AuthRequest, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result = await AuthService.requestAccess(email);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Request failed",
      });
    }
  }

  // Check email approval status
  static async checkEmailStatus(req: AuthRequest, res: Response) {
    try {
      const { email } = req.query;

      if (!email || typeof email !== "string") {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const isApproved = await AccessRequestService.isEmailApproved(email);
      return res.json({
        success: true,
        email,
        isApproved,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Logout
  static async logout(req: AuthRequest, res: Response) {
    if (req.user) {
      const ActivityLog = (await import("../models/ActivityLog.js")).default;
      await ActivityLog.create({
        userId: req.user.userId,
        action: "LOGOUT",
        resource: "User",
      });
    }
    res.clearCookie("token");
    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
