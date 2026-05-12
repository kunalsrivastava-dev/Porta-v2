import express from "express";
import { AdminController } from "../controllers/AdminController.js";
import { MonitoringController } from "../controllers/MonitoringController.js";
import { AnalyticsController } from "../controllers/AnalyticsController.js";
import { authMiddleware, authorize } from "../middlewares/auth.js";

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authMiddleware);
router.use(authorize(["ADMIN"]));

// Access request management
router.get("/requests", AdminController.getAllRequests);
router.get("/requests/pending", AdminController.getPendingRequests);
router.patch("/requests/:requestId/approve", AdminController.approveRequest);
router.patch("/requests/:requestId/reject", AdminController.rejectRequest);
router.post("/invite", AdminController.inviteUser);
router.post("/revoke", AdminController.revokeAccess);
 
// Monitoring (Admins & Interns)
router.get("/monitoring/logs", authorize(["ADMIN"]), MonitoringController.getActivityLogs);
router.get("/monitoring/stats", MonitoringController.getSystemStats);
router.get("/intelligence-stats", AnalyticsController.getIntelligenceStats);

export default router;
