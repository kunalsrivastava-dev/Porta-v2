import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import User from "../models/User.js";

interface AdminCredential {
  email: string;
  password: string;
}

export const initializeAdmins = async (): Promise<void> => {
  try {
    const adminsFilePath = path.resolve("admins.txt");

    // Check if admins.txt exists
    if (!fs.existsSync(adminsFilePath)) {
      console.warn("⚠ admins.txt file not found. No admin users initialized.");
      return;
    }

    // Read admins.txt
    const fileContent = fs.readFileSync(adminsFilePath, "utf-8");
    const lines = fileContent.split("\n").filter((line) => line.trim());

    const admins: AdminCredential[] = [];

    // Parse admins.txt
    for (const line of lines) {
      const [email, password] = line.split(":");
      if (email && password) {
        admins.push({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });
      }
    }

    // Create or update admin users
    for (const admin of admins) {
      try {
        const existingAdmin = await User.findOne({ email: admin.email });

        if (!existingAdmin) {
          // Hash password
          const hashedPassword = await bcryptjs.hash(admin.password, 12);

          // Create new admin
          await User.create({
            name: admin.email.split("@")[0],
            email: admin.email,
            password: hashedPassword,
            role: "ADMIN",
            isApproved: true,
            isActive: true,
          });

          console.log(`✓ Admin created: ${admin.email}`);
        } else {
          // Update password if different
          const passwordMatch = await bcryptjs.compare(
            admin.password,
            existingAdmin.password
          );

          if (!passwordMatch) {
            const hashedPassword = await bcryptjs.hash(admin.password, 12);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "ADMIN";
            existingAdmin.isApproved = true;
            await existingAdmin.save();
            console.log(`✓ Admin updated: ${admin.email}`);
          }
        }
      } catch (error) {
        console.error(`✗ Error processing admin ${admin.email}:`, error);
      }
    }
  } catch (error) {
    console.error("✗ Error initializing admins:", error);
  }
};
