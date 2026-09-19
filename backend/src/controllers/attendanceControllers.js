import Attendance from "../models/Attendance.js";

export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayDate = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Check if user is on an approved leave today
    const Leave = (await import("../models/Leave.js")).default;
    const approvedLeaves = await Leave.find({ employeeId: userId, status: "Approved" });
    
    const isOnLeave = approvedLeaves.some(leave => {
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      return todayDate >= from && todayDate <= to;
    });

    if (isOnLeave) {
      return res.status(400).json({ success: false, message: "You are on an approved leave today and cannot check in." });
    }

    let attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (attendance) {
      if (attendance.checkInTime) {
        return res.status(400).json({ success: false, message: "Already checked in today" });
      }
      attendance.checkInTime = new Date();
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        userId,
        date: new Date(),
        checkInTime: new Date(),
        status: "Present"
      });
    }

    res.status(200).json({ success: true, attendance, message: "Checked in successfully" });
  } catch (error) {
    console.error("CheckIn Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ success: false, message: "Not checked in today" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ success: false, message: "Already checked out today" });
    }

    attendance.checkOutTime = new Date();
    await attendance.save();

    res.status(200).json({ success: true, attendance, message: "Checked out successfully" });
  } catch (error) {
    console.error("CheckOut Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
