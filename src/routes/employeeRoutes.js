const express = require("express");

const router = express.Router();

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const {
    createEmployeeSchema,
    updateEmployeeSchema,
    employeeQuerySchema,
    employeeIdSchema,
} = require("../validators/employee.validator");

/*
|--------------------------------------------------------------------------
| Employee Routes
|--------------------------------------------------------------------------
| All employee operations require authentication.
| Currently restricted to admin users, preserving the original
| application's authorization behavior.
|--------------------------------------------------------------------------
*/

router.use(protect);
router.use(authorize("admin"));

router.post(
    "/",
    validate(createEmployeeSchema, "body"),
    createEmployee
);

router.get(
    "/",
    validate(employeeQuerySchema, "query"),
    getEmployees
);

router.get(
    "/:id",
    validate(employeeIdSchema, "params"),
    getEmployeeById
);

router.patch(
    "/:id",
    validate(employeeIdSchema, "params"),
    validate(updateEmployeeSchema, "body"),
    updateEmployee
);

router.delete(
    "/:id",
    validate(employeeIdSchema, "params"),
    deleteEmployee
);

module.exports = router;