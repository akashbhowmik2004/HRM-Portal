import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadDocument, getDocuments } from "../controllers/documentControllers.js";

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/:employeeId", getDocuments);

export default router;
