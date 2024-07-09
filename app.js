const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const cookieParser = require("cookie-parser");

// Controllers
const accountsController = require("./controllers/accountsController");
const appointmentController = require("./controllers/appointmentController");
const drugRequestController = require("./controllers/drugRequestController");
const drugOrderController = require("./controllers/drugOrderController");
const companyController = require("./controllers/companyController");
const paymentMethodController = require("./controllers/paymentMethodController");
const DrugInventoryController = require("./controllers/drugInventoryController");
const helpRequestsController = require("./controllers/helpRequestsController");
const availableSlotController = require("./controllers/availableSlotController")
const paymentController = require("./controllers/paymentController");
const mailController = require("./controllers/mailController");
const chatbotController = require("./controllers/chatbotController");
const paymentRequestController = require("./controllers/paymentRequestController")
const companyDrugInventoryController = require("./controllers/companyDrugInventoryController");

// Middleware
const validatePatient = require("./middleware/validatePatient");
const validatePaymentMethod = require("./middleware/validatePaymentMethod");
const validatePaymentConfirmationEmail = require("./middleware/validatePaymentConfirmationEmail");
const validateAppointment = require("./middleware/validateAppointment");
const validatePaymentRequest = require("./middleware/validatePaymentRequest")

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
app.get("/api/patient/:patientId", authoriseJWT, accountsController.getPatientById);
app.get("/api/patients/", authoriseJWT, accountsController.getAllPatient);
app.put("/api/patient/:patientId", authoriseJWT, validatePatient, accountsController.updatePatientById);
app.delete("/api/patient/:patientId", authoriseJWT, accountsController.deletePatientById);

// Routes for Patient's Payment Methods
app.get("/api/patient/:patientId/paymentMethods", authoriseJWT, paymentMethodController.getPaymentMethodsByPatientId);
app.post("/api/patient/:patientId/paymentMethods", authoriseJWT, validatePaymentMethod, paymentMethodController.createPaymentMethod);
app.delete("/api/patient/:patientId/paymentMethods/:methodId", authoriseJWT, paymentMethodController.deletePaymentMethod);
app.put("/api/patient/:patientId/paymentMethods/:methodId", authoriseJWT, validatePaymentMethod, paymentMethodController.updatePaymentMethod);

// Route for Managing Patient Payments
app.post("/api/patient/makePayment", authoriseJWT, paymentController.patientMakePayment);

// Route for Sending a Payment Confirmation Email
app.post("/api/mail/paymentConfirmation", authoriseJWT, validatePaymentConfirmationEmail, mailController.sendPaymentConfirmation);

// Route for CareLinc Chatbot
app.post("/api/chatbot/sendMessage", authoriseJWT, chatbotController.sendMessageToChatbot);
app.get("/api/chatbot/history/:patientId", authoriseJWT, chatbotController.getChatbotHistory);
app.post("/api/chatbot/history/:patientId", authoriseJWT, chatbotController.saveChatbotHistory);
app.delete("/api/chatbot/history/:patientId", authoriseJWT, chatbotController.deleteChatbotHistory);

// Routes for Admin-Managing Patient Accounts
app.get("/api/patients/unapproved", authoriseJWT, accountsController.getAllUnapproved);
app.put("/api/staff/patient/:patientId", accountsController.adminUpdatePatientById);

/// Route for Doctor Account
app.get("/api/doctors/", accountsController.getAllDoctor);
app.get("/api/doctors/:doctorId", accountsController.getDoctorById);
app.put("/api/doctors/:doctorId", accountsController.updateDoctorById);
app.delete("/api/doctors/:doctorId", accountsController.deleteDoctorById);

/// Route for Questionnaire
app.get("/api/questionnaire/:accountId", accountsController.getQuestionnaireWithAccountId);

/// Route for Appointments
app.get("/api/appointments/patient/:patientId", authoriseJWT, appointmentController.getAllPatientAppointment);
app.get("/api/appointments/doctor/:doctorId", appointmentController.getAppointmentDetailsByDoctorId);
app.get("/api/appointments/:appointmentId", authoriseJWT, appointmentController.getAppointmentDetailById);
app.put("/api/appointments/:appointmentId", authoriseJWT, validateAppointment, appointmentController.updateAppointmentById);
app.post("/api/appointments", authoriseJWT, validateAppointment, appointmentController.createAppointmentById);
app.delete("/api/appointments/:appointmentId", appointmentController.deleteAppointmentById);

/// Route for Company Account
app.post("/api/auth/create/company", accountsController.authCreateCompany);
app.get("/api/company/:companyId", companyController.getCompanyById);
app.get("/api/drugRequests/", drugRequestController.getAllDrugRequestOrder);
app.get("/api/drugRequest/:id/:drugName", drugRequestController.getDrugOrderByIdAndDrugName);
app.post("/api/drugRequest/:id/:drugName", drugRequestController.cancelDrugOrder);
app.post("/api/drugRequest/contribute/:id/:drugName", drugRequestController.contributeDrugRequest);
app.put("/api/drugRequest/drugContribution", drugRequestController.addRequestContribution);
app.get("/api/drugContributionOrders/", drugOrderController.getAllDrugOrders);
app.delete("/api/drugContributionOrders/:appointmentId/:drugName", drugOrderController.deleteDrugOrder);
app.post("/api/drugInventoryRecord/:drugRecordId/:drugQuantity", drugOrderController.returnMedicine);
app.get("/api/companyDrugInventory/", companyDrugInventoryController.getDrugName);
app.get("/api/companyDrugInventory/:companyId/:drugName", companyDrugInventoryController.getInventoryByDrugName);
app.delete("/api/companyDrugInventory/:companyId/:drugName", companyDrugInventoryController.emptyMedicineFromInventory);

//
app.get("/api/drugInventory", DrugInventoryController.getDrugInventory);

//
app.get("/api/helpRequests", helpRequestsController.getPendingRequests);
app.put("/api/helpRequests/approve/:requestId", helpRequestsController.approveRequest);
app.put("/api/helpRequests/reject/:requestId", helpRequestsController.rejectRequest);

// Route for Available Slot
app.get("/api/availableSlots/:date", availableSlotController.getAllAvailableSlotsTimesByDate);
app.post("/api/availableSlot", availableSlotController.getAvailableSlotByDateAndTime);
app.put("/api/availableSlot/doctor/:slotId", availableSlotController.updateAvailableSlotById);

// Route for Payment Request
app.get("/api/paymentRequest/:appointmentId", paymentRequestController.getPaymentRequestByAppointmentId);
app.post("/api/paymentRequest", validatePaymentRequest, paymentRequestController.createPaymentRequest);
app.delete("/api/paymentRequest/:id", paymentRequestController.cancelPaymentRequest);

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