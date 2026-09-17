import User from "../models/User.js";
import Leave from "../models/Leave.js";
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
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, fromDate, toDate, reason, documentLink } = req.body;
    if(!type || !fromDate || !toDate || !reason) {
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
    const leaveRequest = await Leave.findOne({ _id: leaveId, employeeId: userId });
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
      { new: true }
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
    const leaveRequest = await Leave.findOne({ _id: leaveId, employeeId: userId });
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
