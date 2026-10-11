const productService = require("../services/productService");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const result = await productService.createProduct(req.body);

        res.status(201).json({
            message: "Product created",
            productId: result.ProductID
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await productService.updateProduct(
            req.params.id,
            req.body
        );

        res.json({
            message: "Product updated successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);

        res.json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await productService.getSuppliers();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await productService.getCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
