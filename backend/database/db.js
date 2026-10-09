const sql = require("mssql");

const config = {
    server: "localhost",
    database: "NorthwindMVC",
    options: {
        trustServerCertificate: true
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to NorthwindMVC");
        return pool;
    } catch (err) {
        console.error(err);
    }
}

module.exports = { connectDB };