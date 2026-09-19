import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const fetchTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user.id })
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task status" });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, assignee: req.user.id },
      { status },
      { new: true },
    );
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const fetchUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const employee = await Employee.findOne({ userId });

    let attendancePercentage = 0;
    const Attendance = (await import("../models/Attendance.js")).default;
    const totalPresent = await Attendance.countDocuments({ userId, status: "Present" });
    
    let totalDays = 1;
    if (employee && employee.joiningDate) {
      const joinDate = new Date(employee.joiningDate);
      const today = new Date();
      const diffTime = Math.abs(today - joinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays = diffDays > 0 ? diffDays : 1;
    }
    
    attendancePercentage = Math.round((totalPresent / totalDays) * 100);

    res.status(200).json({
      success: true,
      user,
      employee,
      attendancePercentage,
      attendanceCount: totalPresent,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Leave controllers
export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, fromDate, toDate, reason, documentLink } = req.body;
    if (!type || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const days =
      Math.ceil(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24),
      ) + 1;
    if (days <= 0) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }
    const newLeave = new Leave({
      employeeId: userId,
      type,
      fromDate,
      toDate,
      days,
      reason,
      documentLink,
    });
    await newLeave.save();

    try {
      const { emitNotification } = await import("../../server.js");
      const adminsAndHrs = await User.find({ role: { $in: ["admin", "hr"] }, status: "Active" });
      
      // Need user's name, so let's fetch it
      const currentUser = await User.findById(userId);
      const userName = currentUser ? currentUser.name : "An employee";

      for (const u of adminsAndHrs) {
        await emitNotification(u._id, "New Leave Applied", `${userName} has applied for ${days} days of leave.`);
      }
    } catch (err) {
      console.error("Socket emit failed", err);
    }

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
    });
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const fetchLeaveHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaveHistory = await Leave.find({ employeeId: userId });
    res.status(200).json({
      success: true,
      leaveHistory,
    });
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const editLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaveId = req.params.leaveId;
    const leaveRequest = await Leave.findOne({
      _id: leaveId,
      employeeId: userId,
    });
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    const { type, fromDate, toDate, reason, documentLink } = req.body;
    if (!type || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const days =
      Math.ceil(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24),
      ) + 1;
    if (days <= 0) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { type, fromDate, toDate, days, reason, documentLink },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: "Leave request updated successfully",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("Error editing leave request:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaveId = req.params.leaveId;
    const leaveRequest = await Leave.findOne({
      _id: leaveId,
      employeeId: userId,
    });
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }
    await Leave.deleteOne({ _id: leaveId, employeeId: userId });
    res.status(200).json({
      success: true,
      message: "Leave request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Project controllers
export const createProject = async (req, res) => {
  const { title, content, githubLink, linkedinLink, liveLink } = req.body;
  try {
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee profile not found" });
    }
    
    const newProject = new Project({
      employeeId: employee._id,
      title,
      content,
      githubLink,
      linkedinLink,
      liveLink,
    });
    await newProject.save();
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res.status(200).json({ success: true, projects: [] });
    }
    const projects = await Project.find({ employeeId: employee._id }).populate({
      path: "employeeId",
      populate: {
        path: "userId",
        select: "name email"
      }
    });
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
