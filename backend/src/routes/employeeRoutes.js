import {Router} from "express";

import {fetchUserDetails, applyLeave, fetchLeaveHistory,editLeaveRequest, deleteLeaveRequest} from "../controllers/employeeControllers.js";

const router = Router();

router.get("/get-details", fetchUserDetails);
router.get("/leave-history", fetchLeaveHistory);
router.post("/apply-leave", applyLeave);
router.put("/edit-leave/:leaveId", editLeaveRequest);
router.delete("/delete-leave/:leaveId", deleteLeaveRequest);
export default router;