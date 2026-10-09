const express = require("express");
const router = express.Router();

const customerController = require(
    "../controllers/customerController"
);

const authenticateToken = require(
    "../middleware/authMiddleware"
);

// GET ALL CUSTOMERS
router.get(
    "/",
    authenticateToken,
    customerController.getCustomers
);

// GET CUSTOMER BY ID
router.get(
    "/:id",
    authenticateToken,
    customerController.getCustomerById
);

// CREATE CUSTOMER
router.post(
    "/",
    authenticateToken,
    customerController.createCustomer
);

// UPDATE CUSTOMER
router.put(
    "/:id",
    authenticateToken,
    customerController.updateCustomer
);

// DELETE CUSTOMER
router.delete(
    "/:id",
    authenticateToken,
    customerController.deleteCustomer
);

module.exports = router;