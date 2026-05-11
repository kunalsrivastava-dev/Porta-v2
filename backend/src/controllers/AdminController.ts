import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import { AccessRequestService } from "../services/AccessRequestService.js";

export class AdminController {
  // Get pending access requests
  static async getPendingRequests(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AccessRequestService.getPendingRequests(page, limit);
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

  // Get all access requests
  static async getAllRequests(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AccessRequestService.getAllRequests(page, limit);
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

  // Approve access request
  static async approveRequest(req: AuthRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { role } = req.body;
 
      if (!requestId) {
        return res.status(400).json({
          success: false,
          message: "Request ID is required",
        });
      }

      if (!role || !["DATA_ENTRY", "INTERN"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "A valid role (DATA_ENTRY or INTERN) is required",
        });
      }
 
      const result = await AccessRequestService.approveRequest(
        requestId,
        req.user!.userId,
        role as "DATA_ENTRY" | "INTERN"
      );

      return res.json({
        success: true,
        message: "Access request approved",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Reject access request
  static async rejectRequest(req: AuthRequest, res: Response) {
    try {
      const { requestId } = req.params;
      const { reason } = req.body;

      if (!requestId) {
        return res.status(400).json({
          success: false,
          message: "Request ID is required",
        });
      }

      const result = await AccessRequestService.rejectRequest(
        requestId,
        req.user!.userId,
        reason
      );

      return res.json({
        success: true,
        message: "Access request rejected",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
