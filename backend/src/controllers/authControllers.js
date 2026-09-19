import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { generateOTP } from "../utils/generateOTP.js";
import transporter from "../config/email.js";
import dotenv from "dotenv";
import OTP from "../models/OTP.js";
import User from "../models/User.js";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, name, email, role) => {
  return jwt.sign({ id, name, email, role }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

export const requestOTP = async (req, res) => {
  try {
    const { email, role } = req.body;
    console.log("Requesting OTP for email:", email, "and role:", role);
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or not registered",
      });
    }
    await OTP.deleteMany({ email });

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    await OTP.create({
      email,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log("Generated OTP:", otp);

    await transporter.sendMail({
      from: `"HRM Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your HRM Portal verification code",

      text: `HRM PORTAL

    Verification code

    Hello,

    Use the verification code below to sign in to your HRM Portal account:

    ${otp}

    This code expires in 5 minutes. For your security, do not share it with anyone.

    If you did not request this code, you can safely ignore this email.

    Regards,
    HRM Portal Security Team`,

      html: `
<!DOCTYPE html>
    <html lang="en">
<head>
    <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HRM Portal Verification Code</title>
</head>

    <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, Helvetica, sans-serif; color: #263238;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f8; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #ffffff; border: 1px solid #dfe4e8; border-radius: 8px;">
              <tr>
                <td style="padding: 28px 32px; background-color: #176b87; border-radius: 8px 8px 0 0;">
                  <p style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold;">HRM Portal</p>
                  <p style="margin: 6px 0 0; color: #d8f1f7; font-size: 13px;">Account security notification</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 16px; font-size: 18px; font-weight: bold; color: #1d2b36;">Your verification code</p>
                  <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6;">Hello,</p>
                  <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6;">Use the verification code below to sign in to your HRM Portal account.</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" style="padding: 20px; background-color: #eef7f9; border: 1px solid #c7e5eb; border-radius: 6px;">
                        <span style="font-size: 32px; line-height: 1; font-weight: bold; letter-spacing: 6px; color: #176b87;">${otp}</span>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 24px 0 8px; font-size: 14px; line-height: 1.6;"><strong>This code expires in 5 minutes.</strong></p>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #5d6b75;">For your security, do not share this code with anyone.</p>
                  <hr style="margin: 28px 0; border: 0; border-top: 1px solid #e5e9ec;">
                  <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #687780;">If you did not request this code, you can safely ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 32px; background-color: #fafbfc; border-top: 1px solid #e5e9ec; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0; font-size: 12px; color: #7a878f;">Regards,<br>HRM Portal Security Team</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
</body>
</html>
`,
    });

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Email sending failed:", error);

    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};

export const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
    });

    // No OTP found
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found for this email",
      });
    }

    // Maximum attempts reached
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // OTP expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }
    console.log(otp, typeof otp, otpRecord.otpHash, typeof otpRecord.otpHash);

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, otpRecord.otpHash);
    // Invalid OTP
    if (!isValidOTP) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        attemptsLeft: 5 - otpRecord.attempts,
      });
    }

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check whether account is active
    if (user.status !== "Active") {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(403).json({
        success: false,
        message: "Your account has been disabled",
      });
    }

    // Create JWT
    const token = createToken(user._id, user.name, user.email, user.role);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      path: "/",
    });

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        employmentType: user.employmentType,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("OTP verification failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const verifyUsers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const userData = await User.findById(req.user.id).select("-password");
    
    // Calculate attendance percentage for the user
    let attendancePercentage = 0;
    let attendanceCount = 0;
    try {
      const Attendance = (await import("../models/Attendance.js")).default;
      const Employee = (await import("../models/Employee.js")).default;
      const employee = await Employee.findOne({ userId: req.user.id });
      
      const totalPresent = await Attendance.countDocuments({ userId: req.user.id, status: "Present" });
      attendanceCount = totalPresent;
      
      let totalDays = 1;
      const startDate = (employee && employee.joiningDate) ? new Date(employee.joiningDate) : new Date(userData.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays = diffDays > 0 ? diffDays : 1;
      
      attendancePercentage = Math.round((totalPresent / totalDays) * 100);
    } catch (err) {
      console.error("Error calculating attendance in verify:", err);
    }

    res.status(200).json({
      success: true,
      user: { ...userData._doc, attendancePercentage, attendanceCount },
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
