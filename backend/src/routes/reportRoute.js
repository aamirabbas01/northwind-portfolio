const express = require("express");
const router = express.Router();
const authenticateToken = require(
    "../middleware/authMiddleware"
);
const reportController = require("../controllers/reportController");
router.get("/sales-by-category", authenticateToken, reportController.getSalesByCategoryReport);
router.get("/supplier-product", reportController.getSupplierProdcutReport);

module.exports = router;