const dashboardService = require("../services/dashboardService");

exports.getSalesData = async (req, res) => {
    try {
        const data =
            await dashboardService.getSalesData();

        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getDashboardMetrics = async (req, res) => {
    try {
        const metrics =
            await dashboardService.getDashboardMetrics();

        res.json(metrics);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
