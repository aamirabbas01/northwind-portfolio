const { connectDB } = require("../database/db");

async function getCustomers() {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT
            CustomerID,
            CompanyName,
            ContactName,
            ContactTitle,
            Address,
            City,
            Region,
            PostalCode,
            Country,
            Phone,
            Fax
        FROM Customers
        ORDER BY CompanyName
    `);

    return result.recordset;
}

async function getCustomerById(id) {
    const pool = await connectDB();

    const result = await pool.request()
        .input("CustomerID", id)
        .query(`
            SELECT
                CustomerID,
                CompanyName,
                ContactName,
                ContactTitle,
                Address,
                City,
                Region,
                PostalCode,
                Country,
                Phone,
                Fax
            FROM Customers
            WHERE CustomerID = @CustomerID
        `);

    return result.recordset[0];
}

async function createCustomer(customer) {
    const pool = await connectDB();

    await pool.request()
        .input("CustomerID", customer.CustomerID)
        .input("CompanyName", customer.CompanyName)
        .input("ContactName", customer.ContactName)
        .input("ContactTitle", customer.ContactTitle)
        .input("Address", customer.Address)
        .input("City", customer.City)
        .input("Region", customer.Region)
        .input("PostalCode", customer.PostalCode)
        .input("Country", customer.Country)
        .input("Phone", customer.Phone)
        .input("Fax", customer.Fax)
        .query(`
            INSERT INTO Customers (
                CustomerID,
                CompanyName,
                ContactName,
                ContactTitle,
                Address,
                City,
                Region,
                PostalCode,
                Country,
                Phone,
                Fax
            )
            VALUES (
                @CustomerID,
                @CompanyName,
                @ContactName,
                @ContactTitle,
                @Address,
                @City,
                @Region,
                @PostalCode,
                @Country,
                @Phone,
                @Fax
            )
        `);

    return {
        message: "Customer created successfully"
    };
}

async function updateCustomer(id, customer) {
    const pool = await connectDB();

    await pool.request()
        .input("CustomerID", id)
        .input("CompanyName", customer.CompanyName)
        .input("ContactName", customer.ContactName)
        .input("ContactTitle", customer.ContactTitle)
        .input("Address", customer.Address)
        .input("City", customer.City)
        .input("Region", customer.Region)
        .input("PostalCode", customer.PostalCode)
        .input("Country", customer.Country)
        .input("Phone", customer.Phone)
        .input("Fax", customer.Fax)
        .query(`
            UPDATE Customers
            SET
                CompanyName = @CompanyName,
                ContactName = @ContactName,
                ContactTitle = @ContactTitle,
                Address = @Address,
                City = @City,
                Region = @Region,
                PostalCode = @PostalCode,
                Country = @Country,
                Phone = @Phone,
                Fax = @Fax
            WHERE CustomerID = @CustomerID
        `);

    return {
        message: "Customer updated successfully"
    };
}

async function deleteCustomer(id) {
    const pool = await connectDB();

    await pool.request()
        .input("CustomerID", id)
        .query(`
            DELETE FROM Customers
            WHERE CustomerID = @CustomerID
        `);

    return {
        message: "Customer deleted successfully"
    };
}

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};