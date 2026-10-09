const sql = require("mssql");
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    options: {
        instanceName: "SQLEXPRESS",
        trustServerCertificate: true,
        encrypt: false
    }
};

async function connectDB() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error("SQL ERROR:", err);
        throw err;
    }
}

module.exports = { connectDB };