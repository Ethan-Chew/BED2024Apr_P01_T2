const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const authLoginUser = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.getUserByUsername(username);

        if (!user) return res.status(404).json({ message: "User not found" });

        const checkPasswordMatch = await bcrypt.compare(password, user.password);
        if (!checkPasswordMatch) return res.status(403).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const tokenMaxAge = 10800 // 3 hours (seconds)
        const token = await jwt.sign(
            JSON.stringify(user),
            process.env.JWT_SECRET,
            {
                expiresIn: tokenMaxAge
            }
        )
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: tokenMaxAge * 1000, // 3 hours (ms)
        });

        res.status(200).json({ status: "success", "userId": user.id })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
};

const getUserByUsername = async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.getUserByUsername(username);
        
        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json({ message: "User not found" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    authLoginUser,
    getUserByUsername,
}