import Attendance from "../models/Attendance.js";



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

export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const attendance = await Attendance.find({ userId }).sort({ date: -1 });
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Get My Attendance Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("userId", "name email").sort({ date: -1 });
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.error("Get All Attendance Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getTodayStatus = async (req, res) => {
  try {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const User = (await import("../models/User.js")).default;
    const Leave = (await import("../models/Leave.js")).default;
    
    // Get all employees
    const employees = await User.find({ role: "employee", status: "Active" }).select("name email");
    
    // Get today's attendance logs
    const attendances = await Attendance.find({
      date: { $gte: todayStart, $lt: todayEnd }
    }).populate("userId", "name email");

    // Get today's approved leaves
    const leaves = await Leave.find({
      status: "Approved",
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart }
    }).populate("employeeId", "name email");

    const present = [];
    const late = [];
    const onLeave = [];
    const absent = [];

    // Track processed users
    const processedIds = new Set();

    // 1. Process Leaves
    for (const leave of leaves) {
      if (!leave.employeeId) continue;
      const uId = leave.employeeId._id.toString();
      if (!processedIds.has(uId)) {
        onLeave.push({
          _id: leave.employeeId._id,
          name: leave.employeeId.name,
          email: leave.employeeId.email,
          leaveType: leave.leaveType,
        });
        processedIds.add(uId);
      }
    }

    // 2. Process Attendance
    for (const att of attendances) {
      if (!att.userId) continue;
      const uId = att.userId._id.toString();
      if (!processedIds.has(uId)) {
        const checkIn = new Date(att.checkInTime);
        const isLate = checkIn.getHours() > 9 || (checkIn.getHours() === 9 && checkIn.getMinutes() > 30);
        
        const record = {
          _id: att.userId._id,
          name: att.userId.name,
          email: att.userId.email,
          checkInTime: att.checkInTime,
          checkOutTime: att.checkOutTime,
        };

        if (isLate) {
          late.push(record);
        } else {
          present.push(record);
        }
        processedIds.add(uId);
      }
    }

    // 3. Remaining are Absent
    for (const emp of employees) {
      const uId = emp._id.toString();
      if (!processedIds.has(uId)) {
        absent.push({
          _id: emp._id,
          name: emp.name,
          email: emp.email,
        });
      }
    }

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees: employees.length,
        presentCount: present.length + late.length,
        lateCount: late.length,
        onLeaveCount: onLeave.length,
        absentCount: absent.length,
      },
      lists: {
        present,
        late,
        onLeave,
        absent
      }
    });
  } catch (error) {
    console.error("Get Today Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const checkInWebcam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { faceDescriptor } = req.body;

    if (!faceDescriptor || faceDescriptor.length !== 128) {
      return res.status(400).json({ success: false, message: "Invalid or missing face descriptor." });
    }

    const Employee = (await import("../models/Employee.js")).default;
    const employee = await Employee.findOne({ userId });

    if (!employee || !employee.faceDescriptor || employee.faceDescriptor.length === 0) {
      return res.status(404).json({ success: false, message: "No enrolled face found. Please contact HR to enroll your face." });
    }

    const distance = computeEuclideanDistance(faceDescriptor, employee.faceDescriptor);
    
    // Threshold lowered to 0.45 for stricter face matching
    if (distance > 0.45) {
      return res.status(401).json({ success: false, message: "Face verification failed. Identity does not match." });
    }

    // 1. Check if user is on an approved leave today
    const todayDate = new Date();
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
      return res.status(400).json({ success: false, message: "You are on an approved leave today and cannot check in/out." });
    }

    // Verify successful, determine if it's check-in or check-out
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    const existingAttendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (existingAttendance && existingAttendance.checkInTime && existingAttendance.checkOutTime) {
      return res.status(400).json({ success: false, message: "You have already completed your attendance for today." });
    }

    let updatedAttendance;
    let actionMessage = "";

    if (existingAttendance && existingAttendance.checkInTime && !existingAttendance.checkOutTime) {
      // Perform Check-Out
      existingAttendance.checkOutTime = new Date();
      
      // Calculate working duration in minutes
      const diffMs = existingAttendance.checkOutTime - existingAttendance.checkInTime;
      const diffMins = Math.round(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      existingAttendance.workingDuration = `${hours}h ${mins}m`;

      updatedAttendance = await existingAttendance.save();
      actionMessage = "Face verified and checked out successfully.";
    } else if (existingAttendance && !existingAttendance.checkInTime) {
      // Previously created (e.g. Leave), now checking in
      existingAttendance.checkInTime = new Date();
      existingAttendance.checkInMethod = "webcam";
      existingAttendance.status = "Present";
      updatedAttendance = await existingAttendance.save();
      actionMessage = "Face verified and checked in successfully.";
    } else {
      // Perform Check-In
      updatedAttendance = new Attendance({
        userId,
        date: todayStart,
        checkInTime: new Date(),
        checkInMethod: "webcam",
        status: "Present"
      });
      await updatedAttendance.save();
      actionMessage = "Face verified and checked in successfully.";
    }

    res.status(200).json({
      success: true,
      message: actionMessage,
      attendance: updatedAttendance
    });
  } catch (error) {
    console.error("Webcam Punch Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

function computeEuclideanDistance(desc1, desc2) {
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  return Math.sqrt(sum);
}
