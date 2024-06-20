const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");

// Controllers
const accountsController = require("./controllers/accountsController");
const appointmentController = require("./controllers/appointmentController");

// Middleware
const validatePatient = require("./middleware/validatePatient");

const app = express();
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Routes
/// Routes for Account Authentication and Authorisation
app.post("/auth/login", accountsController.authLoginAccount);
app.post("/auth/create/patient", validatePatient, accountsController.authCreatePatient);

/// Route for Patient Account
app.get("/patient/:patientId", accountsController.getPatientById);
app.delete("/patient/:patientId", accountsController.deletePatientById);

/// Route for Appointments
app.get("/appointments/patient/:patientId", appointmentController.getAllPatientAppointment);
app.get("/appointments/:appointmentId", appointmentController.getAppointmentDetailById);
app.delete("/appointments/:appointmentId", appointmentController.deleteAppointmentById);

// Initialise Server
app.listen(3000, async () => {
    console.log("CareLinc listening on port 3000.")

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