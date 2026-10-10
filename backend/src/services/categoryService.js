const { connectDB } = require("../database/db");
const sql = require("mssql");

async function getCategories() {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            CategoryID,
            CategoryName,
            Description,
            Picture
        FROM Categories
        ORDER BY CategoryName
    `);

    return result.recordset.map(category => {
        let pictureBase64 = null;

        if (category.Picture) {
            let imageBytes = category.Picture;

            // THIS IS THE CODE WE WERE TALKING ABOUT
            if (
                imageBytes.length > 2 &&
                imageBytes[0] === 0x42 &&
                imageBytes[1] === 0x4D
            ) {
                // Standard BMP
            }
            else if (
                imageBytes.length > 78 &&
                imageBytes[78] === 0x42 &&
                imageBytes[79] === 0x4D
            ) {
                // Old Northwind OLE BMP
                imageBytes = imageBytes.slice(78);
            }

            pictureBase64 = Buffer
                .from(imageBytes)
                .toString("base64");
        }

        return {
            ...category,
            PictureBase64: pictureBase64
        };
    });
}

async function getCategoryById(id) {
    const pool = await connectDB();

    const result = await pool.request()
        .input("CategoryID", sql.Int, id)
        .query(`
            SELECT
                CategoryID,
                CategoryName,
                Description,
                Picture
            FROM Categories
            WHERE CategoryID = @CategoryID
        `);

    const category = result.recordset[0];

    if (!category) {
        return null;
    }

    let pictureBase64 = null;

    if (category.Picture) {
        let imageBytes = category.Picture;

        // THIS IS THE CODE WE WERE TALKING ABOUT
        if (
            imageBytes.length > 2 &&
            imageBytes[0] === 0x42 &&
            imageBytes[1] === 0x4D
        ) {
            // Standard BMP
        }
        else if (
            imageBytes.length > 78 &&
            imageBytes[78] === 0x42 &&
            imageBytes[79] === 0x4D
        ) {
            // Old Northwind OLE BMP
            imageBytes = imageBytes.slice(78);
        }

        pictureBase64 = Buffer
            .from(imageBytes)
            .toString("base64");
    }

    return {
        ...category,
        PictureBase64: pictureBase64
    };
}

async function createCategory(category) {

    const pool = await connectDB();

    let pictureBuffer = null;

    if (category.Picture) {
        pictureBuffer = Buffer.from(
            category.Picture,
            "base64"
        );
    }

    await pool.request()
        .input("CategoryName", category.CategoryName)
        .input("Description", category.Description)
        .input("Picture", sql.Image, pictureBuffer)
        .query(`
            INSERT INTO Categories (
                CategoryName,
                Description,
                Picture
            )
            VALUES (
                @CategoryName,
                @Description,
                @Picture
            )
        `);

    return {
        message: "Category created successfully"
    };
}

async function updateCategory(id, category) {

    const pool = await connectDB();

    let pictureBuffer = null;

    if (category.Picture) {
        pictureBuffer = Buffer.from(
            category.Picture,
            "base64"
        );
    }

    await pool.request()
        .input("CategoryID", sql.Int, id)
        .input("CategoryName", category.CategoryName)
        .input("Description", category.Description)
        .input("Picture", sql.Image, pictureBuffer)
        .query(`
            UPDATE Categories
            SET
                CategoryName = @CategoryName,
                Description = @Description,
                Picture = COALESCE(@Picture, Picture)
            WHERE CategoryID = @CategoryID
        `);

    return {
        message: "Category updated successfully"
    };
}

async function deleteCategory(id) {

    const pool = await connectDB();

    await pool.request()
        .input("CategoryID", sql.Int, id)
        .query(`
            DELETE FROM Categories
            WHERE CategoryID = @CategoryID
        `);

    return {
        message: "Category deleted successfully"
    };
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
