const { connectDB } = require("../database/db");
const sql = require("mssql");

async function getSalesData() {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            DATENAME(MONTH, o.OrderDate) AS Month,
            MONTH(o.OrderDate) AS MonthNumber,
            SUM(
                od.UnitPrice *
                od.Quantity *
                (1 - od.Discount)
            ) AS TotalSales
        FROM Orders o
        INNER JOIN [Order Details] od
            ON o.OrderID = od.OrderID
        GROUP BY
            DATENAME(MONTH, o.OrderDate),
            MONTH(o.OrderDate)
        ORDER BY
            MonthNumber
    `);

    return result.recordset.map(row => ({
        month: row.Month,
        totalSales: Number(row.TotalSales)
    }));
}

async function getDashboardMetrics() {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            (SELECT COUNT(*) FROM Orders) AS TotalOrders,
            (SELECT COUNT(*) FROM Customers) AS ActiveCustomers,
            (SELECT COUNT(*) FROM Products) AS ProductsCatalog,
            (SELECT COUNT(*) FROM Employees) AS TotalEmployees
    `);

    const row = result.recordset[0];

    return {
        totalOrders: row.TotalOrders,
        activeCustomers: row.ActiveCustomers,
        productsCatalog: row.ProductsCatalog,
        totalEmployees: row.TotalEmployees
    };
}
module.exports = {
    getSalesData,
    getDashboardMetrics
};