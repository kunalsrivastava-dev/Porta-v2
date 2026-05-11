import mongoose from "mongoose";

interface IAccessRequest {
  email: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  assignedRole?: "DATA_ENTRY" | "INTERN";
}

const accessRequestSchema = new mongoose.Schema<IAccessRequest>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    assignedRole: {
      type: String,
      enum: ["DATA_ENTRY", "INTERN"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
accessRequestSchema.index({ email: 1 });
accessRequestSchema.index({ status: 1 });

export default mongoose.model<IAccessRequest>(
  "AccessRequest",
  accessRequestSchema
);
