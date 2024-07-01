const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const cookieParser = require("cookie-parser");

// Controllers
const accountsController = require("./controllers/accountsController");
const appointmentController = require("./controllers/appointmentController");
const drugRequestController = require("./controllers/drugRequestController");
const companyController = require("./controllers/companyController");
const paymentMethodController = require("./controllers/paymentMethodController");
const DrugInventoryController = require("./controllers/drugInventoryController");
const helpRequestsController = require("./controllers/helpRequestsController");
const availableSlotController = require("./controllers/availableSlotController")
const paymentController = require("./controllers/paymentController");
const mailController = require("./controllers/mailController");

// Middleware
const validatePatient = require("./middleware/validatePatient");
const validatePaymentMethod = require("./middleware/validatePaymentMethod");
const validatePaymentConfirmationEmail = require("./middleware/validatePaymentConfirmationEmail");

// JWT Verification Middleware
const authoriseJWT = require("./middleware/authoriseJWT");

const app = express();
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(staticMiddleware);

// Routes
/// Routes for Account Authentication and Authorisation
app.post("/api/auth/login", accountsController.authLoginAccount);
app.post("/api/auth/create/patient", validatePatient, accountsController.authCreatePatient);

/// Route for Patient Account
app.get("/api/patient/:patientId", accountsController.getPatientById);
app.get("/api/patients/", accountsController.getAllPatient);
app.put("/api/patient/:patientId", validatePatient, accountsController.updatePatientById);
app.delete("/api/patient/:patientId", accountsController.deletePatientById);

// Routes for Patient's Payment Methods
app.get("/api/patient/:patientId/paymentMethods", paymentMethodController.getPaymentMethodsByPatientId);
app.post("/api/patient/:patientId/paymentMethods", validatePaymentMethod, paymentMethodController.createPaymentMethod);
app.delete("/api/patient/:patientId/paymentMethods/:methodId", paymentMethodController.deletePaymentMethod);
app.put("/api/patient/:patientId/paymentMethods/:methodId", validatePaymentMethod, paymentMethodController.updatePaymentMethod);

// Route for Managing Patient Payments
app.post("/api/patient/makePayment", authoriseJWT, paymentController.patientMakePayment);

// Route for Sending a Payment Confirmation Email
app.post("/api/mail/paymentConfirmation", authoriseJWT, validatePaymentConfirmationEmail, mailController.sendPaymentConfirmation);

// Routes for Admin-Managing Patient Accounts
app.get("/api/patients/unapproved", accountsController.getAllUnapproved);
app.put("/api/staff/patient/:patientId", accountsController.adminUpdatePatientById);

/// Route for Doctor Account
app.get("/api/doctors/", accountsController.getAllDoctor);
app.get("/api/doctors/:doctorId", accountsController.getDoctorById);
app.put("/api/doctors/:doctorId", accountsController.updateDoctorById);

/// Route for Questionnaire
app.get("/api/questionnaire/:accountId", accountsController.getQuestionnaireWithAccountId);

/// Route for Appointments
app.get("/api/appointments/patient/:patientId", appointmentController.getAllPatientAppointment);
app.get("/api/appointments/doctor/:doctorId", appointmentController.getAppointmentDetailsByDoctorId);
app.get("/api/appointments/:appointmentId", appointmentController.getAppointmentDetailById);
app.delete("/api/appointments/:appointmentId", appointmentController.deleteAppointmentById);

/// Route for Company Account
app.post("/api/auth/create/company", accountsController.authCreateCompany);
app.get("/api/company/:companyId", companyController.getCompanyById);
app.get("/api/drugRequests/", drugRequestController.getAllDrugRequestOrder);
app.get("/api/drugRequest/:id/:drugName", drugRequestController.getDrugOrderByIdAndDrugName)
app.post("/api/drugRequest/contribute/:id/:drugName", drugRequestController.contributeDrugRequest);

//
app.get("/api/drugInventory", DrugInventoryController.getDrugInventory);

//
app.get("/api/helpRequests", helpRequestsController.getPendingRequests);
app.put("/api/helpRequests/approve/:requestId", helpRequestsController.approveRequest);
app.put("/api/helpRequests/reject/:requestId", helpRequestsController.rejectRequest);

// Route for Available Slot
app.put("/api/availableSlot/doctor/:slotId", availableSlotController.updateAvailableSlotById);

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