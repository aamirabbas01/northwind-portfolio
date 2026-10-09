const employeeService = require("../services/employeeService");

exports.getEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getEmployees();
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeById(
            req.params.id
        );

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const result = await employeeService.createEmployee(
            req.body
        );

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const result = await employeeService.updateEmployee(
            req.params.id,
            req.body
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const result = await employeeService.deleteEmployee(
            req.params.id
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};