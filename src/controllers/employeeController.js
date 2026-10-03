const employeeService = require("../services/employeeService");

const createEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.createEmployee({
            ...req.body,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully.",
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

const getEmployees = async (req, res, next) => {
    try {
        const result = await employeeService.getEmployees(
            req.validatedQuery
        );

        return res.status(200).json({
            success: true,
            total: result.totalEmployees,
            page: result.page,
            pages: result.pages,
            count: result.count,
            data: result.employees,
        });
    } catch (error) {
        next(error);
    }
};

const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await employeeService.getEmployeeById(
            req.validatedParams.id
        );

        return res.status(200).json({
            success: true,
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        const employee = await employeeService.updateEmployee(
            req.validatedParams.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully.",
            data: employee,
        });
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        await employeeService.deleteEmployee(
            req.validatedParams.id
        );

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

const getStats = async (req, res, next) => {
    try {
        const stats = await employeeService.getStats();

        return res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getStats,
};