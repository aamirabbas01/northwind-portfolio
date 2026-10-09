const userService = require("../services/userService");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await userService.loginUser(
            email,
            password
        );

        return res.status(200).json(result);

    } catch (error) {
        console.error("[AUTH CRASH]", error);

        if (error.message === "Invalid credentials") {
            return res.status(401).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const result = await userService.registerUser(
            email,
            password,
            firstName,
            lastName
        );

        res.status(201).json(result);

    } catch (error) {
        console.error("[REGISTER ERROR]", error);

        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};