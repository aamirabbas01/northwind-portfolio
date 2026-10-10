const express = require("express");
const router = express.Router();

const categoryController = require(
    "../controllers/categoryController"
);

const authenticateToken = require(
    "../middleware/authMiddleware"
);

router.get(
    "/",
    authenticateToken,
    categoryController.getCategories
);

router.get(
    "/:id",
    authenticateToken,
    categoryController.getCategoryById
);

router.post(
    "/",
    authenticateToken,
    categoryController.createCategory
);

router.put(
    "/:id",
    authenticateToken,
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authenticateToken,
    categoryController.deleteCategory
);

module.exports = router;