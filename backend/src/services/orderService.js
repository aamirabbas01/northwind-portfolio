const { connectDB } = require("../database/db");
const sql = require("mssql");

const getOrders = async () => {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            o.OrderID,
            c.CompanyName,
            CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
            o.OrderDate,
            o.RequiredDate,
            o.ShippedDate,
            o.Freight,
            o.ShipCountry
        FROM Orders o
        INNER JOIN Customers c
            ON o.CustomerID = c.CustomerID
        INNER JOIN Employees e
            ON o.EmployeeID = e.EmployeeID
        ORDER BY o.OrderID DESC
    `);

    return result.recordset;
};

const getOrderById = async (id) => {
    const pool = await connectDB();

    const result = await pool.request()
        .input("OrderID", sql.Int, id)
        .query(`
            SELECT
                o.*,
                c.CompanyName,
                CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName
            FROM Orders o
            INNER JOIN Customers c
                ON o.CustomerID = c.CustomerID
            INNER JOIN Employees e
                ON o.EmployeeID = e.EmployeeID
            WHERE o.OrderID = @OrderID
        `);

    return result.recordset[0];
};

const getOrderItems = async (orderId) => {
    const pool = await connectDB();

    const result = await pool.request()
        .input("OrderID", sql.Int, orderId)
        .query(`
            SELECT
                od.OrderID,
                od.ProductID,
                p.ProductName,
                od.UnitPrice,
                od.Quantity,
                od.Discount,
                (
                    od.UnitPrice *
                    od.Quantity *
                    (1 - od.Discount)
                ) AS LineTotal
            FROM [Order Details] od
            INNER JOIN Products p
                ON p.ProductID = od.ProductID
            WHERE od.OrderID = @OrderID
            ORDER BY p.ProductName
        `);

    return result.recordset;
};

const getCustomers = async () => {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            CustomerID,
            CompanyName
        FROM Customers
        ORDER BY CompanyName
    `);

    return result.recordset;
};

const getEmployees = async () => {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            EmployeeID,
            CONCAT(FirstName, ' ', LastName) AS EmployeeName
        FROM Employees
        ORDER BY EmployeeName
    `);

    return result.recordset;
};

const getProducts = async () => {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            ProductID,
            ProductName,
            UnitPrice
        FROM Products
        ORDER BY ProductName
    `);

    return result.recordset;
};

const createOrder = async (order) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);

        const headerResult = await request
            .input("CustomerID", sql.NVarChar, order.CustomerID)
            .input("EmployeeID", sql.Int, order.EmployeeID)
            .input("OrderDate", sql.DateTime, order.OrderDate)
            .input("RequiredDate", sql.DateTime, order.RequiredDate)
            .input("ShipVia", sql.Int, order.ShipVia)
            .input("Freight", sql.Decimal(18, 2), order.Freight)
            .input("ShipName", sql.NVarChar, order.ShipName)
            .input("ShipAddress", sql.NVarChar, order.ShipAddress)
            .input("ShipCity", sql.NVarChar, order.ShipCity)
            .input("ShipRegion", sql.NVarChar, order.ShipRegion)
            .input("ShipPostalCode", sql.NVarChar, order.ShipPostalCode)
            .input("ShipCountry", sql.NVarChar, order.ShipCountry)
            .query(`
                INSERT INTO Orders
                (
                    CustomerID,
                    EmployeeID,
                    OrderDate,
                    RequiredDate,
                    Freight,
                    ShipName,
                    ShipAddress,
                    ShipCity,
                    ShipRegion,
                    ShipPostalCode,
                    ShipCountry
                )
                VALUES
                (
                    @CustomerID,
                    @EmployeeID,
                    @OrderDate,
                    @RequiredDate,
                    @Freight,
                    @ShipName,
                    @ShipAddress,
                    @ShipCity,
                    @ShipRegion,
                    @ShipPostalCode,
                    @ShipCountry
                )

                SELECT SCOPE_IDENTITY() AS OrderID;
            `);

        const orderId = headerResult.recordset[0].OrderID;

        for (const item of order.items) {
            await new sql.Request(transaction)
                .input("OrderID", sql.Int, orderId)
                .input("ProductID", sql.Int, item.ProductID)
                .input("UnitPrice", sql.Decimal(18, 2), item.UnitPrice)
                .input("Quantity", sql.SmallInt, item.Quantity)
                .input("Discount", sql.Float, item.Discount || 0)
                .query(`
                    INSERT INTO [Order Details]
                    (
                        OrderID,
                        ProductID,
                        UnitPrice,
                        Quantity,
                        Discount
                    )
                    VALUES
                    (
                        @OrderID,
                        @ProductID,
                        @UnitPrice,
                        @Quantity,
                        @Discount
                    )
                `);
        }

        await transaction.commit();

        return orderId;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateOrder = async (orderId, order) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        await new sql.Request(transaction)
            .input("OrderID", sql.Int, orderId)
            .input("CustomerID", sql.NVarChar, order.CustomerID)
            .input("EmployeeID", sql.Int, order.EmployeeID)
            .input("Freight", sql.Decimal(18, 2), order.Freight)
            .input("ShipName", sql.NVarChar, order.ShipName)
            .input("ShipAddress", sql.NVarChar, order.ShipAddress)
            .input("ShipCity", sql.NVarChar, order.ShipCity)
            .input("ShipRegion", sql.NVarChar, order.ShipRegion)
            .input("ShipPostalCode", sql.NVarChar, order.ShipPostalCode)
            .input("ShipCountry", sql.NVarChar, order.ShipCountry)
            .query(`
                UPDATE Orders
                SET
                    CustomerID = @CustomerID,
                    EmployeeID = @EmployeeID,
                    Freight = @Freight,
                    ShipName = @ShipName,
                    ShipAddress = @ShipAddress,
                    ShipCity = @ShipCity,
                    ShipRegion = @ShipRegion,
                    ShipPostalCode = @ShipPostalCode,
                    ShipCountry = @ShipCountry
                WHERE OrderID = @OrderID
            `);

        await new sql.Request(transaction)
            .input("OrderID", sql.Int, orderId)
            .query(`
                DELETE FROM [Order Details]
                WHERE OrderID = @OrderID
            `);

        for (const item of order.items) {
            await new sql.Request(transaction)
                .input("OrderID", sql.Int, orderId)
                .input("ProductID", sql.Int, item.ProductID)
                .input("UnitPrice", sql.Decimal(18, 2), item.UnitPrice)
                .input("Quantity", sql.SmallInt, item.Quantity)
                .input("Discount", sql.Float, item.Discount)
                .query(`
                    INSERT INTO [Order Details]
                    (
                        OrderID,
                        ProductID,
                        UnitPrice,
                        Quantity,
                        Discount
                    )
                    VALUES
                    (
                        @OrderID,
                        @ProductID,
                        @UnitPrice,
                        @Quantity,
                        @Discount
                    )
                `);
        }

        await transaction.commit();

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deleteOrder = async (orderId) => {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        await new sql.Request(transaction)
            .input("OrderID", sql.Int, orderId)
            .query(`
                DELETE FROM [Order Details]
                WHERE OrderID = @OrderID
            `);

        await new sql.Request(transaction)
            .input("OrderID", sql.Int, orderId)
            .query(`
                DELETE FROM Orders
                WHERE OrderID = @OrderID
            `);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getOrders,
    getOrderById,
    getOrderItems,
    getCustomers,
    getEmployees,
    getProducts,
    createOrder,
    updateOrder,
    deleteOrder
};