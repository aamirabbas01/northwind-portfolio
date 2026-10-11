const express = require("express");
const router = express.Router();
const authenticateToken = require(
    "../middleware/authMiddleware"
);
const productController = require("../controllers/productController");
router.get("/suppliers", authenticateToken, productController.getSuppliers);
router.get("/categories", authenticateToken, productController.getCategories);
router.get("/", authenticateToken, productController.getAllProducts);

router.get("/:id", authenticateToken, productController.getProductById);

router.post("/", authenticateToken, productController.createProduct);

router.put("/:id", authenticateToken, productController.updateProduct);

router.delete("/:id", authenticateToken, productController.deleteProduct);


module.exports = router;