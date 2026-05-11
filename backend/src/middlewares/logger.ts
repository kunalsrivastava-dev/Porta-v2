import { Request, Response, NextFunction } from "express";
import ActivityLog from "../models/ActivityLog.js";
import { AuthRequest } from "./auth.js";

export const logActivity = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Capture the original send method
  const originalSend = res.send;

  res.send = function (data: any) {
    // Only log successful mutating requests or specific important actions
    const isMutating = ["POST", "PUT", "DELETE", "PATCH"].includes(req.method);
    const isImportantPath = req.path.includes("/auth/login") || req.path.includes("/data/upload");

    if (res.statusCode < 400 && req.user && (isMutating || isImportantPath)) {
      const action = req.method + " " + req.path;

      // Queue logging - don't wait for it to complete
      ActivityLog.create({
        userId: req.user.userId,
        action: action,
        resource: req.path.split("/")[1] || "system",
        ipAddress: req.ip,
        details: { 
          method: req.method,
          path: req.path,
          statusCode: res.statusCode
        }
      }).catch((error) => console.error("Error logging activity:", error));
    }

    // Call the original send method
    res.send = originalSend;
    return originalSend.call(this, data);
  };

  next();
};
