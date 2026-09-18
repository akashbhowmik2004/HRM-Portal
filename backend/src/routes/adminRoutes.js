import { Router } from "express";

import {
  getAllUsers,
  createUser,
  createEmployee,
  updateEmployee,
  getLeaveRequests,
  acceptLeaveRequest,
  rejectLeaveRequest,
  assignTask,
  getTasks,
  getAllEmployees,
  toggleUserStatus,
  assignDepertmentToEmployee,
  createAnnouncement,
  getAllAnnouncements,
  getAllProjects,
  reviewProject,
} from "../controllers/adminControllers.js";
import {
  createDepartment,
  getAllDepartments,
} from "../controllers/departmentControllers.js";

const router = Router();

router.get("/users", getAllUsers);
router.get("/employees", getAllEmployees);
router.get("/announcements", getAllAnnouncements);
router.get("/leave-requests", getLeaveRequests);
router.get("/departments", getAllDepartments);
router.get("/tasks", getTasks);

router.post("/create-user", createUser);
router.post("/create-employee", createEmployee);
router.post("/assign-department", assignDepertmentToEmployee);
router.post("/announcements", createAnnouncement);
router.post("/departments", createDepartment);
router.post("/tasks", assignTask);

router.put("/toggle-user-status/:userId", toggleUserStatus);
router.put("/employees/:employeeId", updateEmployee);
router.put("/leave-requests/accept/:leaveId", acceptLeaveRequest);
router.put("/leave-requests/reject/:leaveId", rejectLeaveRequest);
router.get("/projects", getAllProjects);
router.put("/projects/:projectId/review", reviewProject);
export default router;
