const express = require("express");
const router = express.Router();

const orderController =
    require("../controllers/orderController");

const authenticateToken = require(
    "../middleware/authMiddleware"
);

router.get(
    "/customers", authenticateToken,
    orderController.getCustomers
);

router.get(
    "/employees", authenticateToken,
    orderController.getEmployees
);

router.get(
    "/products", authenticateToken,
    orderController.getProducts
);

router.get(
    "/",
    orderController.getOrders
);

router.get(
    "/:id", authenticateToken,
    orderController.getOrderById
);

router.post(
    "/", authenticateToken,
    orderController.createOrder
);

router.put(
    "/:id", authenticateToken,
    orderController.updateOrder
);

router.delete(
    "/:id", authenticateToken,
    orderController.deleteOrder
);

module.exports = router;