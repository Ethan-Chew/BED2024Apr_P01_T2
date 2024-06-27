const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");

// Controllers
const accountsController = require("./controllers/accountsController");
const appointmentController = require("./controllers/appointmentController");
const drugRequestController = require ("./controllers/drugRequestController");
const companyController = require("./controllers/companyController");
const paymentMethodController = require("./controllers/paymentMethodController");

// Middleware
const validatePatient = require("./middleware/validatePatient");
const validatePaymentMethod = require("./middleware/validatePaymentMethod");

const app = express();
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Routes
/// Routes for Account Authentication and Authorisation
app.post("/api/auth/login", accountsController.authLoginAccount);
app.post("/api/auth/create/patient", validatePatient, accountsController.authCreatePatient);

/// Route for Patient Account
app.get("/api/patient/:patientId", accountsController.getPatientById);
app.get("/api/patient/:patientId/paymentMethods", paymentMethodController.getPaymentMethodsByPatientId);
app.post("/api/patient/:patientId/paymentMethods", validatePaymentMethod, paymentMethodController.createPaymentMethod);
app.delete("/api/patient/:patientId/paymentMethods", paymentMethodController.deletePaymentMethod);
app.get("/api/patients/", accountsController.getAllPatient);
app.get("/api/patients/unapproved", accountsController.getAllUnapproved);
app.put("/api/patient/:patientId", validatePatient, accountsController.updatePatientById);
app.put("/api/staff/patient/:patientId", accountsController.adminUpdatePatientById);
app.delete("/api/patient/:patientId", accountsController.deletePatientById);

/// Route for Doctor Account
app.get("/api/doctors/", accountsController.getAllDoctor);
app.get("/api/doctors/:doctorId", accountsController.getDoctorById);
app.put("/api/doctors/:doctorId", accountsController.updateDoctorById);

/// Route for Patient Payment Methods
// app.get("/api/patient/paymentMethods/:patientId", );

/// Route for Questionnaire
app.get("/api/questionnaire/:accountId", accountsController.getQuestionnaireWithAccountId);

/// Route for Appointments
app.get("/api/appointments/patient/:patientId", appointmentController.getAllPatientAppointment);
app.get("/api/appointments/:appointmentId", appointmentController.getAppointmentDetailById);
app.delete("/api/appointments/:appointmentId", appointmentController.deleteAppointmentById);

/// Route for Company Account
app.post("/api/auth/create/company", accountsController.authCreateCompany);
app.get("/api/company/:companyId", companyController.getCompanyById);
app.get("/api/drugRequests/", drugRequestController.getAllDrugRequestOrder);
app.get("/api/drugRequest/:id/:drugName", drugRequestController.getDrugOrderByIdAndDrugName)
app.patch("/api/drugRequest/contribute/:id/:drugName", drugRequestController.contributeDrugRequest);

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