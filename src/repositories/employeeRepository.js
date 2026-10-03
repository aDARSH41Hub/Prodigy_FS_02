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

/*
|--------------------------------------------------------------------------
| Workforce Statistics
|--------------------------------------------------------------------------
*/

const getStats = async () => {
  const [summary, departmentBreakdown] = await Promise.all([
    Employee.aggregate([
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          totalPayroll: { $sum: "$salary" },
          averageSalary: { $avg: "$salary" },
          minimumSalary: { $min: "$salary" },
          maximumSalary: { $max: "$salary" },
        },
      },
    ]),

    Employee.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 },
          averageSalary: { $avg: "$salary" },
        },
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          count: 1,
          averageSalary: {
            $round: ["$averageSalary", 0],
          },
        },
      },
      {
        $sort: {
          count: -1,
          department: 1,
        },
      },
    ]),
  ]);

  const data = summary[0] || {
    totalEmployees: 0,
    totalPayroll: 0,
    averageSalary: 0,
    minimumSalary: 0,
    maximumSalary: 0,
  };

  return {
    totalEmployees: data.totalEmployees,
    totalPayroll: Math.round(data.totalPayroll || 0),
    averageSalary: Math.round(data.averageSalary || 0),
    minimumSalary: data.minimumSalary || 0,
    maximumSalary: data.maximumSalary || 0,
    departments: departmentBreakdown.length,
    departmentBreakdown,
  };
};

module.exports = {
  create,
  findByEmail,
  findMany,
  count,
  findById,
  updateById,
  deleteById,
  getStats,
};