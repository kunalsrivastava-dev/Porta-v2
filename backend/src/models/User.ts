import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "DATA_ENTRY" | "BDA";
  permissions: {
    influencer: { read: boolean; write: boolean };
    bde: { read: boolean; write: boolean };
  };
  isApproved: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["ADMIN", "DATA_ENTRY", "BDA"],
      default: "BDA",
    },
    permissions: {
      influencer: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
      },
      bde: {
        read: { type: Boolean, default: false },
        write: { type: Boolean, default: false },
      },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
