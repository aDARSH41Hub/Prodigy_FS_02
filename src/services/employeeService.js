const AppError = require("../errors/AppError");
const employeeRepository = require("../repositories/employeeRepository");

/*
|--------------------------------------------------------------------------
| Create Employee
|--------------------------------------------------------------------------
*/

const createEmployee = async (employeeData) => {
    const existingEmployee =
        await employeeRepository.findByEmail(employeeData.email);

    if (existingEmployee) {
        throw new AppError(
            "An employee with this email already exists.",
            409,
            "EMPLOYEE_EMAIL_EXISTS"
        );
    }

    try {
        return await employeeRepository.create(employeeData);
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                "An employee with this email already exists.",
                409,
                "EMPLOYEE_EMAIL_EXISTS"
            );
        }

        throw error;
    }
};

/*
|--------------------------------------------------------------------------
| Get Employees
|--------------------------------------------------------------------------
*/

const getEmployees = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {
    const query = {};

    if (search) {
        query.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                department: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const skip = (page - 1) * limit;

    const [employees, totalEmployees] =
        await Promise.all([
            employeeRepository.findMany({
                query,
                skip,
                limit,
            }),
            employeeRepository.count(query),
        ]);

    return {
        employees,
        totalEmployees,
        page,
        pages: Math.ceil(totalEmployees / limit),
        count: employees.length,
    };
};

/*
|--------------------------------------------------------------------------
| Get Employee By ID
|--------------------------------------------------------------------------
*/

const getEmployeeById = async (id) => {
    const employee =
        await employeeRepository.findById(id);

    if (!employee) {
        throw new AppError(
            "Employee not found.",
            404,
            "EMPLOYEE_NOT_FOUND"
        );
    }

    return employee;
};

/*
|--------------------------------------------------------------------------
| Update Employee
|--------------------------------------------------------------------------
*/

const updateEmployee = async (id, updateData) => {
    /*
     * If email is being changed, prevent duplicate employee emails.
     */
    if (updateData.email) {
        const existingEmployee =
            await employeeRepository.findByEmail(
                updateData.email
            );

        if (
            existingEmployee &&
            existingEmployee._id.toString() !== id
        ) {
            throw new AppError(
                "An employee with this email already exists.",
                409,
                "EMPLOYEE_EMAIL_EXISTS"
            );
        }
    }

    try {
        const employee =
            await employeeRepository.updateById(
                id,
                updateData
            );

        if (!employee) {
            throw new AppError(
                "Employee not found.",
                404,
                "EMPLOYEE_NOT_FOUND"
            );
        }

        return employee;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError(
                "An employee with this email already exists.",
                409,
                "EMPLOYEE_EMAIL_EXISTS"
            );
        }

        throw error;
    }
};

/*
|--------------------------------------------------------------------------
| Delete Employee
|--------------------------------------------------------------------------
*/

const deleteEmployee = async (id) => {
    const employee =
        await employeeRepository.deleteById(id);

    if (!employee) {
        throw new AppError(
            "Employee not found.",
            404,
            "EMPLOYEE_NOT_FOUND"
        );
    }

    return employee;
};

/*
|--------------------------------------------------------------------------
| Get Workforce Statistics
|--------------------------------------------------------------------------
*/

const getStats = async () => {
    return employeeRepository.getStats();
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    getStats,
};