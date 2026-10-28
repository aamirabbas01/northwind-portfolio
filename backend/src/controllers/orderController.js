const orderService = require("../services/orderService");

const getOrders = async (req, res) => {
    try {
        const orders = await orderService.getOrders();

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const order = await orderService.getOrderById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        const orderItems =
            await orderService.getOrderItems(id);

        res.status(200).json({
            ...order,
            items: orderItems
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getCustomers = async (req, res) => {
    try {
        const customers =
            await orderService.getCustomers();

        res.status(200).json(customers);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees =
            await orderService.getEmployees();

        res.status(200).json(employees);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products =
            await orderService.getProducts();

        res.status(200).json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

const createOrder = async (req, res) => {
    try {
        const orderId =
            await orderService.createOrder(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            orderId
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await orderService.updateOrder(
            id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Order updated successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await orderService.deleteOrder(id);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    getCustomers,
    getEmployees,
    getProducts,
    createOrder,
    updateOrder,
    deleteOrder
};