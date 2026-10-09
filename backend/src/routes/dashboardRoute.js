const express = require("express");
const router = express.Router();

const authenticateToken = require(
    "../middleware/authMiddleware"
);

const dashboardController = require(
    "../controllers/dashboardController"
);

router.get(
    "/sales-data",
    authenticateToken,
    dashboardController.getSalesData
)

router.get(
    "/metrics",
    authenticateToken,
    dashboardController.getDashboardMetrics
);

module.exports = router;