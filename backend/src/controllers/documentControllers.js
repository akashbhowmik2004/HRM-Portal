import Document from "../models/Document.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import transporter from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

// Upload a document
export const uploadDocument = async (req, res) => {
  try {
    const { employeeId, title, documentType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (!employeeId || !title || !documentType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const document = await Document.create({
      employeeId,
      title,
      documentType,
      fileUrl,
      uploadedBy: req.user.id
    });

    try {
      const emp = await Employee.findById(employeeId).populate("userId", "email name");
      if (emp && emp.userId && emp.userId.email) {
        const fullDocUrl = `http://localhost:3000${fileUrl}`;
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: emp.userId.email,
          subject: "New HR Document Uploaded",
          html: `<p>Hi ${emp.userId.name},</p>
                 <p>A new document (<strong>${title}</strong>) has been uploaded to your employee profile.</p>
                 <p><a href="${fullDocUrl}" style="display: inline-block; padding: 10px 15px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">View Document</a></p>
                 <p>You can also log in to your HRM dashboard and visit the Documents section to view or download it.</p><br/>
                 <p>Regards,<br/>HRM Portal Team</p>`
        });
      }
    } catch (err) {
      console.error("Failed to send document upload email:", err);
    }

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ success: false, message: "Failed to upload document" });
  }
};

// Get documents for an employee (used by admin/HR and employee)
export const getDocuments = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // We assume employeeId here is the Employee document _id. Wait, it might be easier to use the User _id or Employee _id.
    // Let's just find by employeeId.
    const documents = await Document.find({ employeeId }).populate("uploadedBy", "name role").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};
