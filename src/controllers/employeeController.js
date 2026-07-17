const Employee = require("../models/employee");

/* ----------------------------------------
   CREATE EMPLOYEE
---------------------------------------- */

const createEmployee = async (req, res) => {
  try {
    const { name, email, position, department, salary } = req.body;

    if (!name || !email || !position || !department || salary === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const employeeExists = await Employee.findOne({ email });

    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const employee = await Employee.create({
      name,
      email,
      position,
      department,
      salary,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------------------
   GET ALL EMPLOYEES
---------------------------------------- */

const getEmployees = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { department: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalEmployees = await Employee.countDocuments(query);

    return res.status(200).json({
      success: true,
      total: totalEmployees,
      page,
      pages: Math.ceil(totalEmployees / limit),
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------------------
   GET SINGLE EMPLOYEE
---------------------------------------- */

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid employee ID",
    });
  }
};

/* ----------------------------------------
   UPDATE EMPLOYEE
---------------------------------------- */

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ----------------------------------------
   DELETE EMPLOYEE
---------------------------------------- */

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid employee ID",
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};