import AccessRequest from "../models/AccessRequest.js";
import ActivityLog from "../models/ActivityLog.js";

export class AccessRequestService {
  // Get all pending requests (admin only)
  static async getPendingRequests(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const requests = await AccessRequest.find({ status: "pending" })
      .skip(skip)
      .limit(limit)
      .sort({ requestedAt: -1 });

    const total = await AccessRequest.countDocuments({ status: "pending" });

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get all requests
  static async getAllRequests(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const requests = await AccessRequest.find()
      .skip(skip)
      .limit(limit)
      .sort({ requestedAt: -1 })
      .populate("approvedBy", "name email");

    const total = await AccessRequest.countDocuments();

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Approve access request
  static async approveRequest(
    requestId: string,
    adminId: string,
    role: "DATA_ENTRY" | "BDA"
  ) {
    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      {
        status: "approved",
        approvedBy: adminId,
        approvedAt: new Date(),
        assignedRole: role,
      },
      { new: true }
    );

    if (!request) {
      throw new Error("Request not found");
    }

    // Log activity
    await ActivityLog.create({
      userId: adminId,
      action: "APPROVE_REQUEST",
      resource: "AccessRequest",
      resourceId: requestId,
      details: { email: request.email },
    });

    return request;
  }

  // Reject access request
  static async rejectRequest(
    requestId: string,
    adminId: string,
    reason?: string
  ) {
    const request = await AccessRequest.findByIdAndUpdate(
      requestId,
      {
        status: "rejected",
        approvedBy: adminId,
        approvedAt: new Date(),
        rejectionReason: reason,
      },
      { new: true }
    );

    if (!request) {
      throw new Error("Request not found");
    }

    // Log activity
    await ActivityLog.create({
      userId: adminId,
      action: "REJECT_REQUEST",
      resource: "AccessRequest",
      resourceId: requestId,
      details: { email: request.email, reason },
    });

    return request;
  }

  // Check if email is approved
  static async isEmailApproved(email: string): Promise<boolean> {
    const request = await AccessRequest.findOne({
      email: email.toLowerCase(),
      status: "approved",
    });
    return !!request;
  }

  // Invite a user manually (admin only)
  static async inviteUser(email: string, role: "ADMIN" | "DATA_ENTRY" | "BDA", adminId: string) {
    const existing = await AccessRequest.findOne({ email: email.toLowerCase() });
    
    if (existing && existing.status === "approved") {
      throw new Error("This email is already approved");
    }

    let request;
    if (existing) {
      existing.status = "approved";
      existing.assignedRole = role;
      existing.approvedBy = adminId as any;
      existing.approvedAt = new Date();
      request = await existing.save();
    } else {
      request = await AccessRequest.create({
        email: email.toLowerCase(),
        status: "approved",
        assignedRole: role,
        approvedBy: adminId as any,
        approvedAt: new Date(),
        requestedAt: new Date()
      });
    }

    // Log activity
    await ActivityLog.create({
      userId: adminId,
      action: "APPROVE_REQUEST", // Reusing action or define INVITE_USER
      resource: "AccessRequest",
      details: { email: email.toLowerCase(), role, manual: true },
    });

    return request;
  }

  // Revoke access / Remove approved email
  static async revokeAccess(email: string, adminId: string) {
    const result = await AccessRequest.findOneAndDelete({ email: email.toLowerCase() });
    
    // Also deactivate the user if they exist
    const User = (await import("../models/User.js")).default;
    await User.findOneAndUpdate({ email: email.toLowerCase() }, { isActive: false });

    // Log activity
    await ActivityLog.create({
      userId: adminId,
      action: "DELETE_USER",
      resource: "User",
      details: { email: email.toLowerCase(), revoked: true },
    });

    return result;
  }
}
