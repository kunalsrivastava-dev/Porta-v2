import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";

export class MonitoringController {
  // Get activity logs for monitoring (Admin only)
  static async getActivityLogs(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = (page - 1) * limit;

      // Use aggregation to filter out logs where user is an ADMIN
      const logs = await ActivityLog.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $match: {
            "user.role": { $ne: "ADMIN" }, // Hide fellow Admin's activity
          },
        },
        { $sort: { timestamp: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            action: 1,
            resource: 1,
            resourceId: 1,
            details: 1,
            timestamp: 1,
            "user.name": 1,
            "user.email": 1,
            "user.role": 1,
          },
        },
      ]);

      const total = await ActivityLog.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $match: {
            "user.role": { $ne: "ADMIN" },
          },
        },
        { $count: "count" },
      ]);

      const totalCount = total.length > 0 ? total[0].count : 0;

      return res.json({
        success: true,
        data: {
          logs,
          total: totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get system stats for admin dashboard
  static async getSystemStats(req: AuthRequest, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const totalLeads = await ActivityLog.countDocuments({ resource: "DataRecord" });
      const activeUsers = await User.countDocuments({ isActive: true });

      return res.json({
        success: true,
        data: {
          totalUsers,
          totalLeads,
          activeUsers,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
