const jwt = require("jsonwebtoken");
const authorisedRoles = require("./authorisedRoles");
require("dotenv").config();

const authoriseJWT = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Unauthorised" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Compare the user's role to an object of routes and their authorised roles

        req.user = decoded;
        next();
    });

}