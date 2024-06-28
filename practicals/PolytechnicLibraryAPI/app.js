const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const cookieParser = require("cookie-parser");

// JWT Authenticate Middleware
const verifyJWT = require("./middleware/verifyJWT");

// Controller
const usersController = require("./controllers/usersController");
const booksController = require("./controllers/booksController");

const app = express();
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(staticMiddleware);

// Routes
app.post("/api/auth/login", usersController.authLoginUser);
app.post("/api/auth/register", usersController.authRegisterUser);

app.get("/api/books", verifyJWT, booksController.getAllBooks);
app.put("/api/books/:bookId/availability", verifyJWT, booksController.updateBookAvailability)

// Initialise Server
app.listen(3000, async () => {
    console.log("PolytechnicLibraryAPI listening on port 3000.")

    try {
        await sql.connect(dbConfig);
        console.log("Established connection to Database");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});