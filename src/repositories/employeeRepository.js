const Employee = require("../models/employee");

const create = async (employeeData) => {
    return Employee.create(employeeData);
};

const findByEmail = async (email) => {
    return Employee.findOne({ email });
};

const findMany = async ({ query, skip, limit }) => {
    return Employee.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

const count = async (query) => {
    return Employee.countDocuments(query);
};

const findById = async (id) => {
    return Employee.findById(id);
};

const updateById = async (id, updateData) => {
    return Employee.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );
};

const deleteById = async (id) => {
    return Employee.findByIdAndDelete(id);
};

module.exports = {
    create,
    findByEmail,
    findMany,
    count,
    findById,
    updateById,
    deleteById,
};