const express = require("express");
const router = express.Router();

const authenticateToken = require(
    "../middleware/authMiddleware"
);

const employeeController = require(
    "../controllers/employeeController"
);

router.get(
    "/",
    authenticateToken,
    employeeController.getEmployees
);

router.get(
    "/:id",
    authenticateToken,
    employeeController.getEmployeeById
);

router.post(
    "/",
    authenticateToken,
    employeeController.createEmployee
);

router.put(
    "/:id",
    authenticateToken,
    employeeController.updateEmployee
);

router.delete(
    "/:id",
    authenticateToken,
    employeeController.deleteEmployee
);

module.exports = router;