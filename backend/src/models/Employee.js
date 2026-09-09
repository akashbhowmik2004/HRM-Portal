import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    address: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    joiningDate: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      min: 0,
    },

    profileImage: {
      type: String,
    },
    profileStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employee", employeeSchema);