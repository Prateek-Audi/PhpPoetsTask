const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }

        // Create a new user
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();

        res.status(201)
            .json({
                message: "Signup successful! You can now login",
                success: true
            });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
            success: false,
            error: err.message
            });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errorMsg = 'Authentication failed, incorrect email or password';

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }

        // Validate password
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }

        // Generate JWT Token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200)
            .json({
                message: "Login successful!",
            success: true,
            jwtToken,
            email: user.email,
            name: user.name
            });
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
            success: false,
            error: err.message  
            });
    }
};

module.exports = {
    signup,
    login
}