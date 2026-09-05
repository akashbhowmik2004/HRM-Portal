import User from "../models/User.js";
import Employee from "../models/Employee.js";

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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      userId,
      phone,
      dateOfBirth,
      gender,
      address,
      designation,
      joiningDate,
      salary,
      profileImage,
    } = req.body;
    if (!userId || !designation || !joiningDate) {
      return res.status(400).json({
        success: false,
        message: "User ID, designation, and joining date are required",
      });
    }
    const existingEmployee = await Employee.findOne({ userId });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this user ID already exists",
      });
    }
    const employee = await Employee.create({
      userId,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      address: address || null,
      designation,
      joiningDate,
      salary: salary || null,
      profileImage: profileImage || null,
    });
    await employee.save();
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
