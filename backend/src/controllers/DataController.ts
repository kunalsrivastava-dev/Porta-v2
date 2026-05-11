import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import DataRecord from "../models/DataRecord.js";
import ActivityLog from "../models/ActivityLog.js";
import csvParser from "csv-parser";
import { Readable } from "stream";
import mongoose from "mongoose";
import { IntelligenceEngine } from "../utils/IntelligenceEngine.js";

export class DataController {
  /**
   * Upload data from CSV (Lead, Brand, or Influencer)
   */
  static async uploadData(req: AuthRequest, res: Response) {
    try {
      const { type, mapping: mappingStr } = req.body;
      const mapping = mappingStr ? JSON.parse(mappingStr) : null;

      if (!type || !["LEAD", "BRAND", "INFLUENCER"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Valid data type (LEAD, BRAND, INFLUENCER) is required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const results: any[] = [];
      const stream = Readable.from(req.file.buffer);

      stream
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            if (results.length === 0) {
              return res.status(400).json({
                success: false,
                message: "CSV file is empty",
              });
            }

            const records = results.map((row) => {
              const transformedData: Record<string, any> = {};
              
              if (mapping) {
                // Apply mapping: CSV Header -> System Field
                Object.entries(row).forEach(([header, value]) => {
                  const targetField = mapping[header];
                  if (targetField && targetField !== "") {
                    transformedData[targetField] = value;
                  } else {
                    transformedData[header.toLowerCase().replace(/\s+/g, '_')] = value;
                  }
                });
              } else {
                Object.assign(transformedData, row);
              }

              // Normalize and Tag
              const normalizedData = IntelligenceEngine.normalize(transformedData, type);
              const tags = IntelligenceEngine.generateTags(normalizedData, type);

              return {
                uploadedBy: new mongoose.Types.ObjectId(req.user!.userId),
                data: normalizedData,
                tags: tags,
                status: "pending",
                type: type,
              };
            });

            // Use larger batch size or just insertMany
            // To ensure "fully uploaded", we wait for the entire insert
            await DataRecord.insertMany(records);

            // Log activity
            await ActivityLog.create({
              userId: req.user!.userId,
              action: "UPLOAD_DATA",
              resource: "DataRecord",
              details: { type, count: records.length, mapped: !!mapping },
            });

            res.status(201).json({
              success: true,
              message: `Successfully uploaded ${records.length} ${type.toLowerCase()}s`,
              count: records.length,
            });
          } catch (err: any) {
            console.error("Insert error:", err);
            res.status(500).json({
              success: false,
              message: "Error saving records: " + err.message,
            });
          }
        })
        .on("error", (err) => {
          console.error("CSV parse error:", err);
          res.status(500).json({
            success: false,
            message: "Error parsing CSV: " + err.message,
          });
        });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Create a single record manually
   */
  static async createRecord(req: AuthRequest, res: Response) {
    try {
      const { type, data } = req.body;

      if (!type || !data) {
        return res.status(400).json({
          success: false,
          message: "Type and data are required",
        });
      }

      const record = await DataRecord.create({
        uploadedBy: req.user!.userId,
        type,
        data,
        status: "pending",
      });

      // Log activity
      await ActivityLog.create({
        userId: req.user!.userId,
        action: "UPLOAD_DATA", // Or CREATE_DATA if we define it
        resource: "DataRecord",
        resourceId: record._id,
        details: { type, manual: true },
      });

      return res.status(201).json({
        success: true,
        message: "Record created successfully",
        data: record,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get data with filtering and search
   */
  static async getData(req: AuthRequest, res: Response) {
    try {
      const { type, status, tags, assignedTo, search } = req.query;
      const query: any = {};

      if (type) query.type = type;
      if (status) {
        const statusArray = String(status).split(',');
        query.status = { $in: statusArray };
      }
      if (tags) {
        const tagsArray = String(tags).split(',');
        query.tags = { $all: tagsArray }; // Must have all selected tags
      }
      if (assignedTo) query.assignedTo = assignedTo;

      // MongoDB full text search or regex on data fields is complex
      // For now, we'll fetch and filter if search is present, 
      // or use a regex on common fields if possible.
      
      let dbQuery = DataRecord.find(query)
        .populate("uploadedBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 });

      let records = await dbQuery;

      // Apply search across the dynamic 'data' field and 'tags'
      if (search) {
        const searchStr = String(search).toLowerCase();
        records = records.filter((record) =>
          JSON.stringify(record.data).toLowerCase().includes(searchStr) ||
          record.tags?.some(tag => tag.toLowerCase().includes(searchStr))
        );
      }

      res.json({
        success: true,
        data: records,
        count: records.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Get stats for visualization
   */
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const { type } = req.query;
      const query: any = {};
      if (type) query.type = type;

      const statusStats = await DataRecord.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const typeStats = await DataRecord.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]);

      const dailyStats = await DataRecord.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]);

      res.json({
        success: true,
        data: {
          statusDistribution: statusStats,
          typeDistribution: typeStats,
          timeline: dailyStats,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Update data status or assignment
   */
  static async updateData(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, assignedTo, notes, data } = req.body;

      const update: any = {};
      if (status) update.status = status;
      if (assignedTo) update.assignedTo = assignedTo;
      if (data) update.data = data; // Data Entry can change values
      if (notes) {
        update.$push = { notes: notes };
      }

      const record = await DataRecord.findByIdAndUpdate(id, update, { new: true });

      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      // Log activity
      await ActivityLog.create({
        userId: req.user!.userId,
        action: "UPDATE_DATA",
        resource: "DataRecord",
        resourceId: record._id,
        details: { type: record.type, status },
      });

      res.json({
        success: true,
        message: "Record updated successfully",
        data: record,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Delete record (Admin only)
   */
  static async deleteData(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const record = await DataRecord.findById(id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      }

      await DataRecord.findByIdAndDelete(id);

      // Log activity
      await ActivityLog.create({
        userId: req.user!.userId,
        action: "DELETE_DATA",
        resource: "DataRecord",
        resourceId: id,
        details: { type: record.type },
      });

      res.json({
        success: true,
        message: "Record deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * Bulk delete records (Admin only)
   */
  static async bulkDelete(req: AuthRequest, res: Response) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No record IDs provided",
        });
      }

      const result = await DataRecord.deleteMany({ _id: { $in: ids } });

      // Log activity
      await ActivityLog.create({
        userId: req.user!.userId,
        action: "DELETE_DATA",
        resource: "DataRecord",
        details: { count: result.deletedCount, bulk: true },
      });

      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} records`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
