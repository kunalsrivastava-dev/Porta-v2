import mongoose from "mongoose";

interface IDataRecord {
  uploadedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  data: Record<string, any>;
  status: "pending" | "in_progress" | "completed" | "rejected";
  type: "LEAD" | "BRAND" | "INFLUENCER";
  notes?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const dataRecordSchema = new mongoose.Schema<IDataRecord>(
  {
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "rejected"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["LEAD", "BRAND", "INFLUENCER"],
      default: "LEAD",
      required: true,
    },
    notes: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
dataRecordSchema.index({ uploadedBy: 1 });
dataRecordSchema.index({ assignedTo: 1 });
dataRecordSchema.index({ status: 1 });
dataRecordSchema.index({ type: 1 });
dataRecordSchema.index({ tags: 1 });
dataRecordSchema.index({ createdAt: -1 });

export default mongoose.model<IDataRecord>("DataRecord", dataRecordSchema);
