const { connectDB } = require("../database/db");
const sql = require("mssql");

const getAllProducts = async () => {
    const pool = await connectDB();

    const result = await pool.request()
        .query(`
            SELECT
                p.ProductID,
                p.ProductName,
                p.QuantityPerUnit,
                p.UnitPrice,
                p.UnitsInStock,
                p.UnitsOnOrder,
                p.ReorderLevel,
                p.Discontinued,
                s.CompanyName,
                c.CategoryName
            FROM [Products] AS p
            LEFT JOIN [Suppliers] AS s
                ON p.SupplierID = s.SupplierID
            LEFT JOIN [Categories] AS c
                ON p.CategoryID = c.CategoryID
        `);

    return result.recordset;
};

const getProductById = async (id) => {
    const pool = await connectDB();

    const result = await pool.request()
        .input("ProductID", sql.Int, id)
        .query(`
            SELECT
                p.ProductID,
                p.ProductName,
                p.SupplierID,
                p.CategoryID,
                p.QuantityPerUnit,
                p.UnitPrice,
                p.UnitsInStock,
                p.UnitsOnOrder,
                p.ReorderLevel,
                p.Discontinued,
                s.CompanyName,
                c.CategoryName
            FROM [Products] AS p
            LEFT JOIN [Suppliers] AS s
                ON p.SupplierID = s.SupplierID
            LEFT JOIN [Categories] AS c
                ON p.CategoryID = c.CategoryID
                WHERE ProductID = @ProductID
        `);

    return result.recordset[0];
};

const createProduct = async (product) => {
    const pool = await connectDB();

    const result = await pool.request()
        .input("ProductName", sql.NVarChar, product.ProductName)
        .input("SupplierID", sql.Int, product.SupplierID)
        .input("CategoryID", sql.Int, product.CategoryID)
        .input("QuantityPerUnit", sql.NVarChar, product.QuantityPerUnit)
        .input("UnitPrice", sql.Decimal(18, 2), product.UnitPrice)
        .input("UnitsInStock", sql.SmallInt, product.UnitsInStock)
        .input("UnitsOnOrder", sql.SmallInt, product.UnitsOnOrder)
        .input("ReorderLevel", sql.SmallInt, product.ReorderLevel)
        .input("Discontinued", sql.Bit, product.Discontinued)
        .query(`
      INSERT INTO Products
      (
        ProductName,
        SupplierID,
        CategoryID,
        QuantityPerUnit,
        UnitPrice,
        UnitsInStock,
        UnitsOnOrder,
        ReorderLevel,
        Discontinued
      )
      VALUES
      (
        @ProductName,
        @SupplierID,
        @CategoryID,
        @QuantityPerUnit,
        @UnitPrice,
        @UnitsInStock,
        @UnitsOnOrder,
        @ReorderLevel,
        @Discontinued
      );

      SELECT SCOPE_IDENTITY() AS ProductID;
    `);

    return result.recordset[0];
};

const updateProduct = async (id, product) => {
    const pool = await connectDB();

    await pool.request()
        .input("ProductID", sql.Int, id)
        .input("ProductName", sql.NVarChar, product.ProductName)
        .input("SupplierID", sql.Int, product.SupplierID)
        .input("CategoryID", sql.Int, product.CategoryID)
        .input("QuantityPerUnit", sql.NVarChar, product.QuantityPerUnit)
        .input("UnitPrice", sql.Decimal(18, 2), product.UnitPrice)
        .input("UnitsInStock", sql.SmallInt, product.UnitsInStock)
        .input("UnitsOnOrder", sql.SmallInt, product.UnitsOnOrder)
        .input("ReorderLevel", sql.SmallInt, product.ReorderLevel)
        .input("Discontinued", sql.Bit, product.Discontinued)
        .query(`
      UPDATE Products
      SET ProductName = @ProductName,
          SupplierID = @SupplierID,
          CategoryID = @CategoryID,
          QuantityPerUnit = @QuantityPerUnit,
          UnitPrice = @UnitPrice,
          UnitsInStock = @UnitsInStock,
          UnitsOnOrder = @UnitsOnOrder,
          ReorderLevel = @ReorderLevel,
          Discontinued = @Discontinued
      WHERE ProductID = @ProductID
    `);

    return true;
};

const deleteProduct = async (id) => {
    const pool = await connectDB();

    await pool.request()
        .input("ProductID", sql.Int, id)
        .query(`
      DELETE FROM Products
      WHERE ProductID = @ProductID
    `);

    return true;
};

const getSuppliers = async () => {
    const pool = await connectDB();

    const result = await pool.request()
        .query(`
            SELECT SupplierID, CompanyName
            FROM [dbo].[Suppliers]
        `);

    return result.recordset;
};

const getCategories = async () => {
    const pool = await connectDB();
    const result = await pool.request()
        .query(`
            SELECT CategoryID, CategoryName
            FROM [dbo].[Categories]
        `);
    return result.recordset;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSuppliers,
    getCategories
};