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
      type: Date,
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
      type: Date,
    },

    salary: {
      type: Number,
      min: 0,
    },

    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employee", employeeSchema);