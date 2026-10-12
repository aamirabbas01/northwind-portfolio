const { connectDB } = require("../database/db");
const sql = require("mssql");

async function getSalesByCategoryReport(StartDate, EndDate) {
    const pool = await connectDB();

    const result = await pool.request()
        .input("StartDate", sql.DateTime, StartDate)
        .input("EndDate", sql.DateTime, EndDate)
        .query(`
        SELECT
        c.CategoryName,
        p.ProductName,
        SUM(od.Quantity)                                        AS UnitsSold,
        SUM(od.UnitPrice * od.Quantity * (1 - od.Discount))     AS TotalSales
        FROM Orders AS o
        INNER JOIN [Order Details] AS od ON od.OrderID    = o.OrderID
        INNER JOIN Products        AS p  ON p.ProductID   = od.ProductID
        INNER JOIN Categories      AS c  ON c.CategoryID  = p.CategoryID
        WHERE o.OrderDate >= @StartDate
        AND o.OrderDate <  DATEADD(DAY, 1, @EndDate)
        GROUP BY c.CategoryName, p.ProductName
        ORDER BY c.CategoryName, TotalSales DESC;
    `);

    return result.recordset;
}

async function getSupplierProductReport() {
    const pool = await connectDB();

    const result = await pool.request()
        .query(`
                SELECT
            s.CompanyName,
            p.ProductName,
            p.UnitPrice,
            p.UnitsInStock
        FROM Suppliers s
        INNER JOIN Products p
            ON s.SupplierID = p.SupplierID
        ORDER BY
            s.CompanyName,
            p.ProductName;
    `);

    return result.recordset;
}


module.exports = {
    getSalesByCategoryReport,
    getSupplierProductReport
}