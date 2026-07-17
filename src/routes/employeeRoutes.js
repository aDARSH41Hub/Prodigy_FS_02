const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

router.use(protect);
router.use(authorize("admin"));

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);

module.exports = router;