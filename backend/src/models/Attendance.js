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
    enum: ["Present", "Absent", "Leave"],
    default: "Present",
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
