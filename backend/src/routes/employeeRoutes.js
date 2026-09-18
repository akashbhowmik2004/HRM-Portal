import {Router} from "express";

import {fetchUserDetails, applyLeave, fetchLeaveHistory,editLeaveRequest, deleteLeaveRequest, fetchTasks, updateTaskStatus, createProject, getAllProjects} from "../controllers/employeeControllers.js";

const router = Router();

router.get("/get-details", fetchUserDetails);
router.get("/tasks", fetchTasks);
router.get("/leave-history", fetchLeaveHistory);
router.get("/projects", getAllProjects);

router.post("/create-project", createProject);
router.post("/apply-leave", applyLeave);

router.put("/tasks/:taskId/status", updateTaskStatus);
router.put("/edit-leave/:leaveId", editLeaveRequest);

router.delete("/delete-leave/:leaveId", deleteLeaveRequest);
export default router;