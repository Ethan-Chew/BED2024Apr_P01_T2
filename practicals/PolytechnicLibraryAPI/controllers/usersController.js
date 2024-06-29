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
            { id: user.id, username: user.username, role: user.role },
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

const authRegisterUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.getUserByUsername(username);
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const createUserRequest = await User.createUser(new User(null, username, hashedPassword, "member"));
        // Generate JWT Token
        const tokenMaxAge = 10800 // 3 hours (seconds)
        const token = await jwt.sign(
            { id: createUserRequest.id, username: createUserRequest.username, role: createUserRequest.role },
            process.env.JWT_SECRET,
            {
                expiresIn: tokenMaxAge
            }
        )
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: tokenMaxAge * 1000, // 3 hours (ms)
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
}
module.exports = {
    authLoginUser,
    authRegisterUser,
}