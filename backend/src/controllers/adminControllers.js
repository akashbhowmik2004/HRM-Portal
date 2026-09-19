import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Task from "../models/Task.js";
import Announcement from "../models/Announcement.js";
import Department from "../models/Depertment.js";
import Project from "../models/Project.js";
import { generateEmployeeId } from "../utils/generateEmployeeId.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["hr", "employee"] } }).select(
      "-password",
    );
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate(
      "userId",
      "name email role isActive status",
    );

    const Attendance = (await import("../models/Attendance.js")).default;
    const employeesWithAttendance = await Promise.all(
      employees.map(async (emp) => {
        const totalPresent = await Attendance.countDocuments({ userId: emp.userId._id, status: "Present" });
        let totalDays = 1;
        if (emp.joiningDate) {
          const joinDate = new Date(emp.joiningDate);
          const today = new Date();
          const diffTime = Math.abs(today - joinDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalDays = diffDays > 0 ? diffDays : 1;
        }
        const attendancePercentage = Math.round((totalPresent / totalDays) * 100);
        return { ...emp._doc, attendancePercentage };
      })
    );

    res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      employees: employeesWithAttendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, role, employmentType } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and role are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      role,
      employmentType: employmentType || null,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const empId = await generateEmployeeId();
    const {
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      department,
      designation,
      joiningDate,
      salary,
      profileImage,
    } = req.body;
    if (!designation || !joiningDate || !email) {
      return res.status(400).json({
        success: false,
        message: "Email, designation, and joining date are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userId = user._id;
    const existingEmployee = await Employee.findById(userId);
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const employee = await Employee.create({
      userId,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      address: address || null,
      department: department || null,
      designation,
      joiningDate,
      salary: salary || null,
      profileImage: profileImage || null,
      employeeId: empId,
    });
    await employee.save();
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const previousDepartmentName = employee.department;
    const nextDepartmentName = req.body.department;

    const fields = [
      "phone",
      "dateOfBirth",
      "gender",
      "address",
      "department",
      "designation",
      "joiningDate",
      "salary",
      "profileImage",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) employee[field] = req.body[field];
    });

    await employee.save();

    if (nextDepartmentName !== undefined && nextDepartmentName !== previousDepartmentName) {
      const user = await User.findById(employee.userId);
      if (user) {
        if (previousDepartmentName) {
          const previousDepartment = await Department.findOne({ name: previousDepartmentName });
          if (previousDepartment) {
            previousDepartment.employees.pull(user._id);
            await previousDepartment.save();
          }
        }
        if (nextDepartmentName) {
          const nextDepartment = await Department.findOne({ name: nextDepartmentName });
          if (nextDepartment) {
            nextDepartment.employees.addToSet(user._id);
            await nextDepartment.save();
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await Leave.find({ status: "Pending" }).populate(
      "employeeId",
      "name email",
    );
    res.status(200).json({
      success: true,
      message: "Leave requests retrieved successfully",
      leaveRequests,
    });
  } catch (error) {
    console.error("Error retrieving leave requests:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptLeaveRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const leaveRequest = await Leave.findById(leaveId);
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }
    leaveRequest.status = "Approved";
    await leaveRequest.save();

    try {
      const { emitNotification } = await import("../../server.js");
      await emitNotification(leaveRequest.employeeId, "Leave Approved", "Your leave request has been approved.");
    } catch (err) {}

    res.status(200).json({
      success: true,
      message: "Leave request approved successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Error approving leave request:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectLeaveRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const rejectionReason = req.body.rejectionReason?.trim();
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "A rejection reason is required",
      });
    }

    const leaveRequest = await Leave.findById(leaveId);
    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }
    leaveRequest.status = "Rejected";
    leaveRequest.rejectionReason = rejectionReason;
    await leaveRequest.save();

    try {
      const { emitNotification } = await import("../../server.js");
      await emitNotification(leaveRequest.employeeId, "Leave Rejected", `Your leave request was rejected: ${rejectionReason}`);
    } catch (err) {}

    res.status(200).json({
      success: true,
      message: "Leave request rejected successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Error rejecting leave request:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignee } = req.body;
    if (!title || !assignee) {
      return res.status(400).json({
        success: false,
        message: "Task title and employee are required",
      });
    }

    const employee = await User.findOne({ _id: assignee, role: "employee" });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      deadline,
      assignee,
      assignedBy: req.user.id,
    });
    
    // Attempt to emit notification
    try {
      const { emitNotification } = await import("../../server.js");
      await emitNotification(assignee, "New Task Assigned", `You have been assigned a new task: ${title}`);
    } catch (err) {
      console.error("Socket emit failed", err);
    }

    const populatedTask = await task.populate("assignee", "name email");
    res.status(201).json({ success: true, task: populatedTask });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignee", "name email")
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.status = user.status === "Active" ? "Inactive" : "Active";
    await user.save();
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const assignDepertmentToEmployee = async (req, res) => {
  try {
    const { employeeId, departmentId } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee user account not found",
      });
    }

    const previousDepartment = employee.department
      ? await Department.findOne({ name: employee.department })
      : null;
    if (previousDepartment && previousDepartment._id.toString() !== departmentId) {
      previousDepartment.employees.pull(user._id);
      await previousDepartment.save();
    }

    employee.department = department.name;
    await employee.save();
    department.employees.addToSet(user._id);
    await department.save();

    res.status(200).json({
      success: true,
      message: "Department assigned to employee successfully",
      employee: await employee.populate("userId", "name email role"),
    });
  } catch (error) {
    console.error("Error assigning department to employee:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


export const createAnnouncement = async (req, res) => {
  try {
    const { headline, body } = req.body;
    if(!headline || !body){
      return res.status(400).json({
        success: false,
        message: "Headline and body are required",
      });
    }
    await Announcement.create({ headline, body });

    try {
      const { emitNotification } = await import("../../server.js");
      const User = (await import("../models/User.js")).default;
      const allUsers = await User.find({ status: "Active" });
      for (const u of allUsers) {
        await emitNotification(u._id, "New Announcement", headline);
      }
    } catch (err) {
      console.error("Socket emit failed", err);
    }

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
    });
  }catch(err){
    console.error("Error creating announcement:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Announcements fetched successfully",
      announcements,
    });
  }catch (err) {
    console.error("Error fetching announcements:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate({
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

export const reviewProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { score, feedback } = req.body;
    
    if (score === undefined || score < 0 || score > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid score. Must be between 0 and 5."
      });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { score, feedback },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project reviewed successfully",
      project
    });
  } catch (error) {
    console.error("Error reviewing project:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};