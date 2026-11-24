import Document from "../models/Document.js";
import Employee from "../models/Employee.js";
import transporter from "../config/email.js";
import dotenv from "dotenv";
import bucket from "../config/upstash.js";
import { emitNotification } from "../config/socket.js";

dotenv.config();

// Upload a document
export const uploadDocument = async (req, res) => {
  try {
    const { employeeId, title, documentType } = req.body;
    const file = req.file;

    if (!employeeId || !title || !documentType || !file) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const safeName = file.originalname.replace(/[^\w.\- ]/g, "_");
    const path = `documents/${employeeId}/${Date.now()}-${safeName}`;
    const uploaded = await bucket.put(path, file.buffer, {
      contentType: file.mimetype || "application/octet-stream",
      maxSize: "20mb",
    });

    const document = await Document.create({
      employeeId,
      title,
      documentType,
      filePath: path,
      fileName: file.originalname,
      fileUrl: uploaded.url || null,
      uploadedBy: req.user.id,
    });

    // Email notification logic remains roughly the same, but the link needs to be changed to a signed download link
    try {
      const emp = await Employee.findById(employeeId).populate(
        "userId",
        "email name",
      );
      if (emp && emp.userId && emp.userId.email) {
        try {
          await emitNotification(
            emp.userId._id,
            "New Document Uploaded",
            `${title} has been added to your employee documents.`,
          );
        } catch (notificationError) {
          console.error("Failed to create document notification:", notificationError);
        }

        const { url: downloadUrl } = await bucket.signedReadUrl(path, {
          expiresIn: "5m",
          downloadAs: file.originalname,
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: emp.userId.email,
          subject: "New HR Document Uploaded",
          html: `<p>Hi ${emp.userId.name},</p>
                 <p>A new document (<strong>${title}</strong>) has been uploaded to your employee profile.</p>
                 <p><a href="${downloadUrl}" style="display: inline-block; padding: 10px 15px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">View Document</a></p>
                 <p>You can also log in to your HRM dashboard and visit the Documents section to view or download it.</p><br/>
                 <p>Regards,<br/>HRM Portal Team</p>`,
        });

      }
    } catch (err) {
      console.error("Failed to send document upload email:", err);
      // Email failure does not affect the main process
    }

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to upload document" });
  }
};

// Get documents for an employee (used by admin/HR and employee)
export const getDocuments = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (req.user.role === "employee") {
      const employee = await Employee.findOne({ userId: req.user.id });
      if (!employee || employee._id.toString() !== employeeId) {
        return res.status(403).json({
          success: false,
          message: "You can only access your own documents",
        });
      }
    } else if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const documents = await Document.find({ employeeId })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch documents" });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    if (req.user.role === "employee") {
      const employee = await Employee.findOne({ userId: req.user.id });
      if (!employee || doc.employeeId.toString() !== employee._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only download your own documents",
        });
      }
    } else if (!["admin", "hr"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { url } = await bucket.signedReadUrl(doc.filePath, {
      expiresIn: "5m",
      downloadAs: doc.fileName || "document.pdf",
    });

    res.json({ success: true, downloadUrl: url });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate download URL" });
  }
};
