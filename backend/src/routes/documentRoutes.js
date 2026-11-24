import { Router } from "express";
import multer from "multer";
import {
  uploadDocument,
  getDocuments,
  downloadDocument,
} from "../controllers/documentControllers.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post(
  "/upload",
  authorizeRoles("admin", "hr"),
  upload.single("file"),
  uploadDocument,
);
router.get("/download/:id", downloadDocument);
router.get("/:employeeId", getDocuments);

export default router;
