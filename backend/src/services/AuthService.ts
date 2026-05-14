import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateToken } from "../utils/jwt.js";
import { validateEmail, validatePassword } from "../utils/validators.js";
import User from "../models/User.js";
import AccessRequest from "../models/AccessRequest.js";
import ActivityLog from "../models/ActivityLog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AuthService {
  // Register a pre-approved user
  static async registerApprovedUser(email: string, name: string, password: string) {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!validatePassword(password)) {
      throw new Error("Password must be at least 6 characters");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Check if email is approved
    const accessRequest = await AccessRequest.findOne({
      email: email.toLowerCase(),
      status: "approved",
    });

    if (!accessRequest) {
      throw new Error(
        "Unauthorized Access: This email address has not been pre-approved by an administrator."
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Assign default permissions based on role
    const assignedRole = accessRequest.assignedRole || "INTERN";
    let defaultPermissions = {
      influencer: { read: false, write: false },
      bde: { read: false, write: false }
    };
    
    if (assignedRole === "ADMIN") {
      defaultPermissions = { influencer: { read: true, write: true }, bde: { read: true, write: true } };
    } else if (assignedRole === "DATA_ENTRY") {
      defaultPermissions.influencer = { read: true, write: true };
    } else if (assignedRole === "INTERN") {
      defaultPermissions.bde = { read: true, write: true };
    }

    // Create user with assigned role
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      permissions: defaultPermissions,
      isApproved: true,
      isActive: true,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: "CREATE_USER",
      resource: "User",
      details: { email: user.email, role: user.role },
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Verify email status for the multi-step auth flow
  static async verifyEmailStatus(email: string) {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const normalizedEmail = email.toLowerCase();

    // 1. Check if email is approved
    const approval = await AccessRequest.findOne({
      email: normalizedEmail,
      status: "approved",
    });

    if (!approval) {
      // Special check: if it's a super admin from the file
      try {
        const adminsPath = path.join(process.cwd(), "admins.txt");
        if (fs.existsSync(adminsPath)) {
          const adminsData = fs.readFileSync(adminsPath, "utf-8");
          const adminLines = adminsData.split("\n").filter(l => l.trim() !== "");
          for (const line of adminLines) {
            const [adminEmail] = line.split(":");
            if (adminEmail === normalizedEmail) {
              // Super admin found in file
              const user = await User.findOne({ email: normalizedEmail });
              return {
                approved: true,
                registered: !!user,
                role: "ADMIN"
              };
            }
          }
        }
      } catch (err) {
        console.error("Admins file check error during verification", err);
      }

      return { approved: false, registered: false };
    }

    // 2. Check if already registered
    const user = await User.findOne({ email: normalizedEmail });

    return {
      approved: true,
      registered: !!user,
      role: user?.role || approval.assignedRole || "INTERN"
    };
  }

  // Login user
  static async login(email: string, password: string) {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error("Invalid email or password");
    }

    // 1. Check admins.txt first for special admin access
    try {
      const adminsPath = path.join(process.cwd(), "admins.txt");
      if (fs.existsSync(adminsPath)) {
        const adminsData = fs.readFileSync(adminsPath, "utf-8");
        const adminLines = adminsData.split("\n").filter(l => l.trim() !== "");
        
        for (const line of adminLines) {
          const [adminEmail, adminPass] = line.split(":");
          if (adminEmail === email && adminPass === password) {
            // Valid admin from file! 
            // Check if user exists in DB, if not create as ADMIN
            let user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
              const hashedPassword = await bcryptjs.hash(password, 12);
              user = await User.create({
                name: "System Admin",
                email: email.toLowerCase(),
                password: hashedPassword,
                role: "ADMIN",
                permissions: { influencer: { read: true, write: true }, bde: { read: true, write: true } },
                isApproved: true,
                isActive: true
              });
            } else {
              // Update role and password if it's different
              user.role = "ADMIN";
              user.permissions = { influencer: { read: true, write: true }, bde: { read: true, write: true } };
              user.password = await bcryptjs.hash(password, 12);
              await user.save();
            }

            return this.generateAuthResponse(user);
          }
        }
      }
    } catch (err) {
      console.error("Admins file error:", err);
    }

    // 2. Regular login flow
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Your account is disabled");
    }

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    return this.generateAuthResponse(user);
  }

  // Generate standard auth response
  private static async generateAuthResponse(user: any) {
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: "LOGIN",
      resource: "User",
    });

    return {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Request access for intern
  static async requestAccess(email: string) {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Check if already requested
    const existingRequest = await AccessRequest.findOne({
      email: email.toLowerCase(),
      status: { $in: ["pending", "approved"] },
    });

    if (existingRequest) {
      throw new Error("You have already requested access");
    }

    // Create access request
    const accessRequest = await AccessRequest.create({
      email: email.toLowerCase(),
      status: "pending",
    });

    // Log activity (public action)
    await ActivityLog.create({
      action: "CREATE_USER", // Use CREATE_USER or define a new one for request
      resource: "AccessRequest",
      details: { email: email.toLowerCase() },
    });

    return {
      success: true,
      message: "Access request submitted. Please wait for admin approval.",
      requestId: accessRequest._id,
    };
  }
}
