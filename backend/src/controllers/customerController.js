const customerService = require("../services/customerService");

exports.getCustomers = async (req, res) => {
    try {
        const customers =
            await customerService.getCustomers();

        res.status(200).json(customers);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer =
            await customerService.getCustomerById(
                req.params.id
            );

        if (!customer) {
            return res.status(404).json({
                error: "Customer not found"
            });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const result =
            await customerService.createCustomer(
                req.body
            );

        res.status(201).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const result =
            await customerService.updateCustomer(
                req.params.id,
                req.body
            );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const result =
            await customerService.deleteCustomer(
                req.params.id
            );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};