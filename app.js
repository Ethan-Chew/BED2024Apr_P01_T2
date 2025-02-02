const express = require("express");
const sql = require("mssql");
const bodyParser = require("body-parser");
const dbConfig = require("./dbConfig");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

// Controllers
const patientsController = require("./controllers/patientsController");
const doctorsController = require("./controllers/doctorController");
const appointmentController = require("./controllers/appointmentController");
const drugRequestController = require("./controllers/drugRequestController");
const drugOrderController = require("./controllers/drugOrderController");
const companyController = require("./controllers/companyController");
const paymentMethodController = require("./controllers/paymentMethodController");
const DrugInventoryController = require("./controllers/drugInventoryController");
const availableSlotController = require("./controllers/availableSlotController")
const paymentController = require("./controllers/paymentController");
const mailController = require("./controllers/mailController");
const chatbotController = require("./controllers/chatbotController");
const paymentRequestController = require("./controllers/paymentRequestController")
const companyDrugInventoryController = require("./controllers/companyDrugInventoryController");
const inventoryRecordController = require("./controllers/inventoryRecordController");
const digitalWalletController = require("./controllers/digitalWalletController");
const digitalWalletHistoryController = require("./controllers/digitalWalletHistoryController");
const drugTopup = require("./controllers/drugTopupController");
const notificationsController = require("./controllers/notificationsController");
const twoFAController = require("./controllers/2FAController");



// Middleware
const validatePatient = require("./middleware/validatePatient");
const validatePaymentMethod = require("./middleware/validatePaymentMethod");
const validatePaymentConfirmationEmail = require("./middleware/validatePaymentConfirmationEmail");
const validateAppointment = require("./middleware/validateAppointment");
const validatePaymentRequest = require("./middleware/validatePaymentRequest");
const validateWalletHistory = require("./middleware/validateWalletHistory");

const validateAddRequestContribution = require("./middleware/validateAddRequestContribution");
const validateContributeDrugRequest = require("./middleware/validateContributeDrugRequest");
const validateDrugOrderByIdAndDrugName = require("./middleware/validateDrugOrderByIdAndDrugName");
const validateApptIdAndDrugName = require("./middleware/validateApptIdAndDrugName");
const validateReturnMedicine = require("./middleware/validateReturnMedicine");
const validateRemoveDrugInputs = require("./middleware/validateRemoveDrugInputs");
const validateCompanyId = require("./middleware/validateCompanyId");
const validateCreateDrugInventoryRecord = require("./middleware/validateCreateDrugInventoryRecord");
const validateCompanyIdAndDrugName = require("./middleware/validateCompanyIdAndDrugName");
const validateDrugRecordId = require("./middleware/validateDrugRecordId");

const validateNotification = require("./middleware/validateNotification")

// JWT Verification Middleware
const authoriseJWT = require("./middleware/authoriseJWT");

const app = express();
const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(staticMiddleware);

// Configure Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
/// Routes for Account Authentication
app.post("/api/auth/login", patientsController.authLoginAccount);

/// Route for Patient Account
app.get("/api/patient/:patientId", authoriseJWT, patientsController.getPatientById);
app.get("/api/patient/admin/:patientId", authoriseJWT, patientsController.getPatientByIdAdmin);
app.get("/api/patients/", authoriseJWT, patientsController.getAllPatient);
app.put("/api/patient/:patientId", authoriseJWT, validatePatient, patientsController.updatePatientById);
app.post("/api/patient", validatePatient, patientsController.authCreatePatient);
app.delete("/api/patient/:patientId", authoriseJWT, patientsController.deletePatientById);
app.delete("/api/patient/admin/:patientId", authoriseJWT, patientsController.deletePatientByIdAdmin);
app.put("/api/patient/approve/:patientId", authoriseJWT, patientsController.approvePatient);
app.put("/api/patient/reject/:patientId", authoriseJWT, patientsController.denyPatient);

// Routes for Patient's Payment Methods
app.get("/api/patient/paymentMethods/:patientId", authoriseJWT, paymentMethodController.getPaymentMethodsByPatientId);
app.post("/api/patient/paymentMethod/:patientId", authoriseJWT, validatePaymentMethod, paymentMethodController.createPaymentMethod);
app.get("/api/patient/paymentMethod/:methodId", authoriseJWT, paymentMethodController.getPaymentMethodById);
app.delete("/api/patient/paymentMethod/:methodId", authoriseJWT, paymentMethodController.deletePaymentMethod);
app.put("/api/patient/paymentMethod/:methodId", authoriseJWT, validatePaymentMethod, paymentMethodController.updatePaymentMethod);

// Routes for Patient's Digital Wallet
app.get("/api/patient/:patientId/digitalWallet", authoriseJWT, digitalWalletController.getDigitalWallet);
app.post("/api/patient/:patientId/digitalWallet", authoriseJWT, digitalWalletController.createDigitalWallet);
app.delete("/api/patient/:patientId/digitalWallet", authoriseJWT, digitalWalletController.deleteDigitalWallet);
app.put("/api/patient/:patientId/digitalWallet", authoriseJWT, digitalWalletController.updateDigitalWalletAmount);

// Routes for Patient's Digital Wallet History
app.get("/api/patient/:patientId/digitalWalletHistory", authoriseJWT, digitalWalletHistoryController.getDigitalWalletHistory);
app.post("/api/patient/:patientId/digitalWalletHistory", authoriseJWT, validateWalletHistory, digitalWalletHistoryController.addDigitalWalletHistory);
app.delete("/api/patient/:patientId/digitalWalletHistory", authoriseJWT, digitalWalletHistoryController.deleteDigitalWalletHistory);

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
app.get("/api/patients/unapproved", authoriseJWT, patientsController.getAllUnapproved);
app.put("/api/staff/patient/:patientId", authoriseJWT, patientsController.adminUpdatePatientById);

/// Route for Doctor Account
app.get("/api/doctors/", authoriseJWT, doctorsController.getAllDoctor);
app.get("/api/doctors/:doctorId", authoriseJWT, doctorsController.getDoctorById);
app.put("/api/doctors/:doctorId", authoriseJWT, doctorsController.updateDoctorById);

/// Route for Questionnaire
app.get("/api/questionnaire/:accountId", authoriseJWT, patientsController.getQuestionnaireWithAccountId);

/// Route for Appointments
app.get("/api/appointments/patient/:patientId", authoriseJWT, appointmentController.getAllPatientAppointment);
app.get("/api/appointments/doctor/:doctorId", appointmentController.getAppointmentDetailsByDoctorId);
app.get("/api/appointments/:appointmentId", authoriseJWT, appointmentController.getAppointmentDetailById);
app.put("/api/appointments/:appointmentId", authoriseJWT, validateAppointment, appointmentController.updateAppointmentById);
app.put("/api/appointments/cancel/:appointmentId", appointmentController.updateAppointmentDoctorSlot);
app.post("/api/appointments", authoriseJWT, validateAppointment, appointmentController.createAppointmentById);
app.delete("/api/appointments/:appointmentId", authoriseJWT, appointmentController.deleteAppointmentById);

/// Route for Company Account
app.post("/api/auth/create/company", companyController.authCreateCompany);
app.get("/api/company/:companyId", authoriseJWT, companyController.getCompanyById);
// Route for Drug Requests (Company)
app.get("/api/drugRequests/", authoriseJWT, drugRequestController.getAllDrugRequestOrder);
app.get("/api/drugRequest/:appointmentId/:drugName/:companyId", authoriseJWT, validateDrugOrderByIdAndDrugName, drugRequestController.getDrugOrderByIdAndDrugName);
app.put("/api/drugRequest/:appointmentId/:drugName", authoriseJWT, validateApptIdAndDrugName, drugRequestController.cancelDrugOrder);
app.put("/api/drugRequest/contribute/:companyId/:appointmentId/:drugName", authoriseJWT, validateContributeDrugRequest, drugRequestController.contributeDrugRequest);
app.post("/api/drugRequest/drugContribution", authoriseJWT, validateAddRequestContribution, drugRequestController.addRequestContribution);
// Route for Drug Orders (Company)
app.get("/api/drugContributionOrders/:companyId", authoriseJWT, validateCompanyId, drugOrderController.getAllDrugOrders);
app.put("/api/drugContributionOrders/:appointmentId/:drugName", authoriseJWT, validateApptIdAndDrugName, drugOrderController.confirmDrugOrder);
app.delete("/api/drugContributionOrders/:appointmentId/:drugName", authoriseJWT, validateApptIdAndDrugName, drugOrderController.deleteDrugOrder);
app.put("/api/drugInventoryRecord/:drugRecordId", authoriseJWT, validateReturnMedicine, drugOrderController.returnMedicine);
// Route for Drug Inventory (Company)
app.get("/api/companyDrugInventory/", authoriseJWT, companyDrugInventoryController.getDrugName);
app.get("/api/companyDrugInventory/:companyId/:drugName", authoriseJWT, validateCompanyIdAndDrugName, companyDrugInventoryController.getInventoryByDrugName);
app.delete("/api/companyDrugInventory/:companyId/:drugName", authoriseJWT, validateCompanyIdAndDrugName, companyDrugInventoryController.emptyMedicineFromInventory);
app.post("/api/companyDrugInventory/addDrug", authoriseJWT, validateCreateDrugInventoryRecord, companyDrugInventoryController.createDrugInventoryRecord);
app.delete("/api/companyDrugInventory/:companyId/:drugName/:drugQuantity", authoriseJWT, validateRemoveDrugInputs, companyDrugInventoryController.removeDrugFromInventoryRecord);
// Route for Drug Inventory Record (Company)
app.get("/api/inventoryRecord/:companyId", authoriseJWT, validateCompanyId, inventoryRecordController.getInventoryRecordByCompanyId);
app.put("/api/inventoryRecord/:drugRecordId", authoriseJWT, validateDrugRecordId, inventoryRecordController.updateDrugQuantityByRecordId);
app.delete("/api/inventoryRecord/:drugRecordId", authoriseJWT, validateDrugRecordId, inventoryRecordController.deleteDrugRecordByRecordId);

// Route for Drug Orders (Admin)
app.post("/api/drugTopup/:drugName", authoriseJWT, drugTopup.requestTopup);

//
app.get("/api/drugInventory", authoriseJWT, DrugInventoryController.getDrugInventory);

//Hervin
app.get("/api/admin/paymentRequests", authoriseJWT, paymentRequestController.getPendingRequests);
app.put("/api/admin/paymentRequest/approve/:requestId", authoriseJWT, paymentRequestController.approveRequest);
app.put("/api/admin/paymentRequest/reject/:requestId", authoriseJWT, paymentRequestController.rejectRequest);

// Route for Available Slot
app.get("/api/availableSlots/:date", authoriseJWT, availableSlotController.getAllAvailableSlotsTimesByDate);
app.post("/api/availableSlot/getByDateTime", authoriseJWT, availableSlotController.getAvailableSlotByDateAndTime);
app.put("/api/availableSlot/doctor/:slotId", authoriseJWT, availableSlotController.updateAvailableSlotById);
app.post("/api/availableSlot", authoriseJWT, availableSlotController.createAvailableSlot);

// Route for Payment Request
app.get("/api/paymentRequests", paymentRequestController.getPaymentRequestsByApprovedStatus);
app.get("/api/paymentRequests/company", authoriseJWT, paymentRequestController.getPaymentRequestStatusByPendingDrugRequest);
app.get("/api/paymentRequest/:appointmentId", authoriseJWT, paymentRequestController.getPaymentRequestByAppointmentId);
app.put("/api/paymentRequest/pay", paymentRequestController.payRequestByRequestId);
app.put("/api/paymentRequest/check", paymentRequestController.checkPaymentRequest);
app.put("/api/paymentRequest/approve/:appointmentId", authoriseJWT, paymentRequestController.approvePaymentRequestByAppointmentId);
app.put("/api/paymentRequest/reject/:appointmentId", authoriseJWT, paymentRequestController.rejectPaymentRequestByAppointmentId);
app.post("/api/paymentRequest", authoriseJWT, validatePaymentRequest, paymentRequestController.createPaymentRequest);
app.delete("/api/paymentRequest/:id", authoriseJWT, paymentRequestController.cancelPaymentRequest);

// Route for Notifications
app.get("/api/notifications/:accountId", authoriseJWT, notificationsController.receiveNotifications);
app.put("/api/notification/:notificationId", authoriseJWT, notificationsController.readNotification);
app.put("/api/notifications/:accountId", authoriseJWT, notificationsController.readAllNotificationsByAccountId);
app.post("/api/notification", authoriseJWT, validateNotification, notificationsController.sendNotification);

// Route for 2FA
app.get('/api/generateQRCode', twoFAController.generateQRCode)
app.get('/api/getAuth/:accountId', twoFAController.getAuth)
app.post('/api/verify2FA/:accountId', twoFAController.verify2FA)

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