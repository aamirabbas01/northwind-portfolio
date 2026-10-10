const categoryService = require(
    "../services/categoryService"
);

exports.getCategories = async (req, res) => {
    try {
        const result =
            await categoryService.getCategories();

        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const result =
            await categoryService.getCategoryById(
                req.params.id
            );

        if (!result) {
            return res.status(404).json({
                error: "Category not found"
            });
        }

        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const result =
            await categoryService.createCategory(
                req.body
            );

        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const result =
            await categoryService.updateCategory(
                req.params.id,
                req.body
            );

        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const result =
            await categoryService.deleteCategory(
                req.params.id
            );

        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};