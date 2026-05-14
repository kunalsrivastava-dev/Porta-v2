import express from "express";
import multer from "multer";
import { DataController } from "../controllers/DataController.js";
import { authMiddleware, authorize } from "../middlewares/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All data routes require authentication
router.use(authMiddleware);

// Upload data
router.post(
  "/upload",
  authorize(["ADMIN", "DATA_ENTRY", "BDA"]),
  upload.single("file"),
  DataController.uploadData
);

// Create manual record
router.post(
  "/",
  authorize(["ADMIN", "DATA_ENTRY", "BDA"]),
  DataController.createRecord
);

// Get data with filtering - All roles
router.get("/", DataController.getData);

// Get stats - All roles
router.get("/stats", DataController.getStats);

// Update data - Admin, Data Entry, BDA
router.patch(
  "/:id",
  authorize(["ADMIN", "DATA_ENTRY", "BDA"]),
  DataController.updateData
);

// Delete data
router.delete("/:id", authorize(["ADMIN", "DATA_ENTRY", "BDA"]), DataController.deleteData);

// Bulk delete data
router.post(
  "/bulk-delete",
  authorize(["ADMIN", "DATA_ENTRY", "BDA"]),
  DataController.bulkDelete
);

export default router;
