import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

export class UserService {
  // Get all users (admin only)
  static async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get user by ID
  static async getUserById(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // Update user role
  static async updateUserRole(
    userId: string,
    newRole: "ADMIN" | "DATA_ENTRY" | "INTERN",
    adminId: string
  ) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Log activity
    await ActivityLog.create({
      userId: adminId,
      action: "UPDATE_USER",
      resource: "User",
      resourceId: userId,
      details: { newRole },
    });

    return user;
  }

  // Activate/deactivate user
  static async toggleUserStatus(userId: string, isActive: boolean, adminId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Log activity
    await ActivityLog.create({
      userId: adminId,
      action: "UPDATE_USER",
      resource: "User",
      resourceId: userId,
      details: { isActive },
    });

    return user;
  }

  // Delete user (hard delete)
  static async deleteUser(userId: string, adminId: string) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Log activity
    await ActivityLog.create({
      userId: adminId,
      action: "DELETE_USER",
      resource: "User",
      resourceId: userId,
      details: { email: user.email },
    });

    return { success: true, message: "User deleted successfully" };
  }

  // Get dashboard stats
  static async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "ADMIN" });
    const dataEntryCount = await User.countDocuments({ role: "DATA_ENTRY" });
    const internCount = await User.countDocuments({ role: "INTERN" });
    const activeUsers = await User.countDocuments({ isActive: true });

    return {
      totalUsers,
      adminCount,
      dataEntryCount,
      internCount,
      activeUsers,
    };
  }
}
