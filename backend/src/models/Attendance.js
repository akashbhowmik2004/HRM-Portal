import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave", "Late", "Half-Day"],
    default: "Present",
  },
  checkInMethod: {
    type: String,
    enum: ["webcam", "manual"],
    default: "manual",
  },
  workingDuration: {
    type: String,
  },
  workingDurationMinutes: {
    type: Number,
    default: 0,
  },
  workingDurationSeconds: {
    type: Number,
    default: 0,
  },
  breakDurationMinutes: {
    type: Number,
    default: 0,
  },
  breakDurationSeconds: {
    type: Number,
    default: 0,
  },
  breaks: [{
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
  }],
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  }
}, { timestamps: true });

// Prevent duplicate attendance records for the same user on the same date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
