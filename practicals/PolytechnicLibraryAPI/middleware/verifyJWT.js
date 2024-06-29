const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Check user role for authorization
        const authorizedRoles = {
            "/api/books": ["member", "librarian"], 
            "/api/books/[0-9]+/availability": ["librarian"],
        };

        const requestedEndpoint = req.url;
        const userRole = decoded.role;

        const authorizedRole = Object.entries(authorizedRoles).find(([endpoint, roles]) => {
            const regex = new RegExp(`^${endpoint}$`);
            return regex.test(requestedEndpoint) && roles.includes(userRole);
        });

        if (!authorizedRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = decoded;
        next();
    });
};

module.exports = verifyJWT;