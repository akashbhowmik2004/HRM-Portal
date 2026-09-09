import User from "../models/User.js";
import Employee from "../models/Employee.js";
import {generateEmployeeId} from "../utils/generateEmployeeId.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, role, employmentType } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and role are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const user = await User.create({
      name,
      email,
      role,
      employmentType: employmentType || null,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const empId = await generateEmployeeId();
    const {
      phone,
      email,
      dateOfBirth,
      gender,
      address,
      designation,
      joiningDate,
      salary,
      profileImage,
    } = req.body;
    if (!designation || !joiningDate || !email) {
      return res.status(400).json({
        success: false,
        message: "Email, designation, and joining date are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userId = user._id;
    const existingEmployee = await Employee.findById(userId);
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const employee = await Employee.create({
      userId ,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      address: address || null,
      designation,
      joiningDate,
      salary: salary || null,
      profileImage: profileImage || null,
      employeeId: empId,
    });
    await employee.save();
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
