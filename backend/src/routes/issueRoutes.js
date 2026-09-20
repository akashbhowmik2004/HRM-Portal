import express from "express";
import { createIssue, getIssues, updateIssueStatus } from "../controllers/issueControllers.js";

const router = express.Router();

router.post("/", createIssue);
router.get("/", getIssues);
router.patch("/:id/status", updateIssueStatus);

export default router;
