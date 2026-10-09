const { connectDB } = require("../database/db");
const sql = require("mssql");

async function getEmployees() {
    const pool = await connectDB();

    const result = await pool.request().query(`
        SELECT *
        FROM Employees
        ORDER BY EmployeeID
    `);

    const employees = result.recordset.map(employee => {

        let photoBase64 = null;

        if (employee.Photo) {

            let imageBytes = employee.Photo;

            // Northwind OLE wrapper
            if (
                imageBytes.length > 78 &&
                imageBytes[78] === 0x42 &&
                imageBytes[79] === 0x4D
            ) {
                imageBytes = imageBytes.slice(78);
            }

            // Standard BMP
            else if (
                imageBytes.length > 2 &&
                imageBytes[0] === 0x42 &&
                imageBytes[1] === 0x4D
            ) {
                // use as-is
            }

            photoBase64 = Buffer
                .from(imageBytes)
                .toString("base64");
        }

        return {
            ...employee,
            PhotoBase64: photoBase64
        };
    });

    return employees;
}

async function getEmployeeById(id) {
    const pool = await connectDB();

    const result = await pool.request()
        .input("EmployeeID", id)
        .query(`
            SELECT
            e.*, CONCAT(m.FirstName, ' ', m.LastName) AS ReportsToName
            FROM Employees e
            LEFT JOIN Employees m ON e.ReportsTo = m.EmployeeID
            WHERE e.EmployeeID = @EmployeeID
        `)

    const employee = result.recordset[0];

    if (!employee) {
        return null;
    }

    let photoBase64 = null;

    if (employee.Photo) {

        let imageBytes = employee.Photo;

        // Northwind OLE header
        if (
            imageBytes.length > 78 &&
            imageBytes[78] === 0x42 &&
            imageBytes[79] === 0x4D
        ) {
            imageBytes = imageBytes.slice(78);
        }

        photoBase64 = Buffer
            .from(imageBytes)
            .toString("base64");
    }

    return {
        ...employee,
        PhotoBase64: photoBase64
    };
}


async function createEmployee(employee) {
    const pool = await connectDB();
    const photoBuffer = employee.Photo
        ? Buffer.from(employee.Photo, "base64")
        : null;
    const result = await pool.request()
        .input("LastName", employee.LastName)
        .input("FirstName", employee.FirstName)
        .input("Title", employee.Title)
        .input("TitleOfCourtesy", employee.TitleOfCourtesy)
        .input("BirthDate", employee.BirthDate)
        .input("HireDate", employee.HireDate)
        .input("Address", employee.Address)
        .input("City", employee.City)
        .input("Region", employee.Region)
        .input("PostalCode", employee.PostalCode)
        .input("Country", employee.Country)
        .input("HomePhone", employee.HomePhone)
        .input("Extension", employee.Extension)
        .input(
            "Photo",
            sql.Image,
            photoBuffer
        )
        .input("Notes", employee.Notes)
        .input("ReportsTo", employee.ReportsTo === null
            ? null
            : Number(employee.ReportsTo)
        )
        .input("PhotoPath", employee.PhotoPath)
        .query(`
            INSERT INTO Employees(
            LastName,
            FirstName,
            Title,
            TitleOfCourtesy,
            BirthDate,
            HireDate,
            Address,
            City,
            Region,
            PostalCode,
            Country,
            HomePhone,
            Extension,
            Photo,
            Notes,
            ReportsTo,
            PhotoPath
        )
    VALUES(
        @LastName,
        @FirstName,
        @Title,
        @TitleOfCourtesy,
        @BirthDate,
        @HireDate,
        @Address,
        @City,
        @Region,
        @PostalCode,
        @Country,
        @HomePhone,
        @Extension,
        @Photo,
        @Notes,
        @ReportsTo,
        @PhotoPath
    );

            SELECT SCOPE_IDENTITY() AS EmployeeID;
    `);

    return result.recordset[0];
}

async function updateEmployee(id, employee) {
    const pool = await connectDB();
    let photoBuffer = null;

    if (employee.Photo) {
        photoBuffer = Buffer.from(
            employee.Photo,
            "base64"
        );
    }

    await pool.request()
        .input("EmployeeID", id)
        .input("LastName", employee.LastName)
        .input("FirstName", employee.FirstName)
        .input("Title", employee.Title)
        .input("TitleOfCourtesy", employee.TitleOfCourtesy)
        .input("BirthDate", employee.BirthDate)
        .input("HireDate", employee.HireDate)
        .input("Address", employee.Address)
        .input("City", employee.City)
        .input("Region", employee.Region)
        .input("PostalCode", employee.PostalCode)
        .input("Country", employee.Country)
        .input("HomePhone", employee.HomePhone)
        .input("Extension", employee.Extension)
        .input("Photo", sql.Image, photoBuffer ?? null)
        .input("Notes", employee.Notes)
        .input("ReportsTo", employee.ReportsTo)
        .input("PhotoPath", employee.PhotoPath)
        .query(`
            UPDATE Employees
    SET
    LastName = @LastName,
        FirstName = @FirstName,
        Title = @Title,
        TitleOfCourtesy = @TitleOfCourtesy,
        BirthDate = @BirthDate,
        HireDate = @HireDate,
        Address = @Address,
        City = @City,
        Region = @Region,
        PostalCode = @PostalCode,
        Country = @Country,
        HomePhone = @HomePhone,
        Extension = @Extension,
        Photo = COALESCE(@Photo, Photo),
        Notes = @Notes,
        ReportsTo = @ReportsTo,
        PhotoPath = @PhotoPath
            WHERE EmployeeID = @EmployeeID
        `);

    return { message: "Employee updated successfully" };
}

async function deleteEmployee(id) {
    const pool = await connectDB();

    await pool.request()
        .input("EmployeeID", id)
        .query(`
            DELETE FROM Employees
            WHERE EmployeeID = @EmployeeID
        `);

    return { message: "Employee deleted successfully" };
}

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};