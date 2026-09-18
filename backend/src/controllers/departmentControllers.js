import Department from "../models/Depertment.js";

export const createDepartment = async (req, res) => {
    try {
        const name = req.body.name?.trim();
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Department name is required",
            });
        }

        const existingDepartment = await Department.findOne({
            name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
        });
        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: "A department with this name already exists",
            });
        }

        const department = await Department.create({ name });
        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            department,
        });
    } catch (error) {
        console.error("Error creating department:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find()
            .populate("employees", "name email role")
            .sort({ name: 1 });
        return res.status(200).json({
            success: true,
            message: "Departments fetched successfully",
            departments,
        });
    } catch (error) {
        console.error("Error fetching departments:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

