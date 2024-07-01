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
        const requestedEndpoint = req.url;
        const userRole = decoded.role;

        const authorizedRole = Object.entries(authorisedRoles).find(([endpoint, roles]) => {
            const regex = new RegExp(`^${endpoint}$`);
            return regex.test(requestedEndpoint) && roles.includes(userRole);
        });

        if (!authorizedRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.user = decoded;
        next();
    });
}

module.exports = authoriseJWT;