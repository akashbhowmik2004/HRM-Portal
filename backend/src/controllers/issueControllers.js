import Issue from "../models/Issue.js";
import User from "../models/User.js";
import { emitNotification } from "../../server.js";

export const createIssue = async (req, res) => {
  try {
    const { name, email, issue } = req.body;

    if (!name || !email || !issue) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newIssue = await Issue.create({ name, email, issue });

    // Find all HRs to send notification
    const hrUsers = await User.find({ role: "hr", status: "Active" });
    for (const hr of hrUsers) {
      await emitNotification(hr._id, "New Issue Submitted", `Issue from ${name} (${email}): ${issue.substring(0, 50)}...`);
    }

    res.status(201).json({ success: true, message: "Issue submitted successfully", issue: newIssue });
  } catch (error) {
    console.error("Error creating issue:", error);
    res.status(500).json({ success: false, message: "Failed to submit issue" });
  }
};

export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ success: false, message: "Failed to fetch issues" });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    res.status(200).json({ success: true, message: "Issue updated", issue });
  } catch (error) {
    console.error("Error updating issue:", error);
    res.status(500).json({ success: false, message: "Failed to update issue" });
  }
};
