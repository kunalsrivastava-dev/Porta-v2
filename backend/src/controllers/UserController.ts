import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { UserService } from "../services/UserService.js";

export class UserController {
  // Get all users (admin only)
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await UserService.getAllUsers(page, limit);
      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user by ID
  static async getUserById(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      return res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get current user profile
  static async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await UserService.getUserById(req.user.userId);
      return res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update user role (admin only)
  static async updateUserRole(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role is required",
        });
      }

      if (!["ADMIN", "DATA_ENTRY", "INTERN"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role",
        });
      }

      const user = await UserService.updateUserRole(
        userId,
        role,
        req.user!.userId
      );

      return res.json({
        success: true,
        message: "User role updated",
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update user permissions (admin only)
  static async updateUserPermissions(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { permissions } = req.body;

      if (!permissions) {
        return res.status(400).json({
          success: false,
          message: "Permissions object is required",
        });
      }

      const user = await UserService.updateUserPermissions(
        userId,
        permissions,
        req.user!.userId
      );

      return res.json({
        success: true,
        message: "User permissions updated",
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Toggle user status
  static async toggleUserStatus(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean",
        });
      }

      const user = await UserService.toggleUserStatus(
        userId,
        isActive,
        req.user!.userId
      );

      return res.json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"}`,
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete user
  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;

      if (userId === req.user?.userId) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      const result = await UserService.deleteUser(userId, req.user!.userId);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get dashboard stats
  static async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const stats = await UserService.getDashboardStats();
      return res.json({
        success: true,
        stats,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
