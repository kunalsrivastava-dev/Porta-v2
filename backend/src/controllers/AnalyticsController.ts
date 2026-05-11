import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import DataRecord from "../models/DataRecord.js";

export class AnalyticsController {
  static async getIntelligenceStats(req: AuthRequest, res: Response) {
    try {
      const { type } = req.query;
      const matchQuery: any = {};
      if (type) matchQuery.type = type;

      // 1. Category Distribution
      const categoryStats = await DataRecord.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$data.category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // 2. City Distribution
      const cityStats = await DataRecord.aggregate([
        { $match: matchQuery },
        { $group: { _id: "$data.city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // 3. Tag Distribution
      const tagStats = await DataRecord.aggregate([
        { $match: matchQuery },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // 4. Revenue Segments
      const revenueStats = await DataRecord.aggregate([
        { $match: matchQuery },
        {
          $bucket: {
            groupBy: "$data.revenue",
            boundaries: [0, 10, 50, 100, 500, 1000],
            default: "500+",
            output: { count: { $sum: 1 } }
          }
        }
      ]);

      return res.json({
        success: true,
        data: {
          categories: categoryStats,
          cities: cityStats,
          tags: tagStats,
          revenue: revenueStats
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}
