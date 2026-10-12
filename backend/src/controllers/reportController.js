const reportService = require("../services/reportService");

exports.getSalesByCategoryReport = async (req, res) => {
    try {
        const { StartDate, EndDate } = req.query;
        const report = await reportService.getSalesByCategoryReport(StartDate, EndDate);
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getSupplierProdcutReport = async (req, res) => {
    try {
        const report = await reportService.getSupplierProductReport();
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}