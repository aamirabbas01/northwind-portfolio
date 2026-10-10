const express = require("express");
const { connectDB } = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoute");
const customerRoutes = require("./routes/customerRoute");
const categoryRoutes = require("./routes/CategoryRoute");

const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", require("./routes/dashboardRoute"));
app.use("/api/categories", categoryRoutes);

const port = process.env.HTTP_PLATFORM_PORT || process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on ${port}`));