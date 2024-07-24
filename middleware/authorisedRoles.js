const authorisedRoles = {
    "/api/patient/:patientId": ["patient", "admin"],
    "/api/patients/": ["patient", "admin"],
    "/api/appointments": ["patient"],
    "/api/appointments/patient/:patientId": ["patient"],
    "/api/appointments/:appointmentId": ["patient"],
    "/api/patient/makePayment": ["patient"],
    "/api/mail/paymentConfirmation": ["patient"],
    "/api/patients/unapproved": ["admin"],
    "/api/patient/paymentMethods/:patientId": ["patient"],
    "/api/patient/paymentMethod/:patientId": ["patient"],
    "/api/patient/paymentMethod/:methodId": ["patient"],
    "/api/chatbot/sendMessage": ["patient"],
    "/api/chatbot/history/:patientId": ["patient"],
    "/api/patient/:patientId/digitalWallet": ["patient"],
    "/api/patient/:patientId/digitalWalletHistory": ["patient"],

    "/api/company/:companyId": ["company"],
    "/api/drugRequests/": ["company"],
    "/api/drugRequest/:appointmentId/:drugName/:companyId": ["company"],
    "/api/drugRequest/:appointmentId/:drugName": ["company"],
    "/api/drugRequest/contribute/:companyId/:appointmentId/:drugName": ["company"],
    "/api/drugRequest/drugContribution": ["company"],
    "/api/drugContributionOrders/:companyId": ["company"],
    "/api/drugContributionOrders/:appointmentId/:drugName": ["company"],
    "/api/drugInventoryRecord/:drugRecordId/:drugQuantity": ["company"],
    "/api/companyDrugInventory/": ["company"],
    "/api/companyDrugInventory/:companyId/:drugName": ["company"],
    "/api/companyDrugInventory/addDrug": ["company"],
    "/api/companyDrugInventory/:companyId/:drugName/:drugQuantity": ["company"],
    "/api/inventoryRecord/:companyId": ["company"],
    "/api/inventoryRecord/:drugRecordId": ["company"],

    "/api/paymentRequests" : ["patient"],
    "/api/paymentRequest/:appointmentId" : ["admin"],
    "/api/paymentRequest/approve/:appointmentId" : ["admin"],
    "/api/paymentRequest/reject/:appointmentId" : ["admin"],
    "/api/paymentRequest" : ["patient"],
    "/api/paymentRequest/:id" : ["patient"],

    "/api/notification/:accountid" : ["patient", "doctor", "admin"],
    "/api/notification/:Notificationid" : ["patient", "doctor"],
    "/api/notifications/:accountid" : ["patient", "doctor"],
    "/api/notification" : ["doctor", "admin"],

    "/api/appointments/cancel/:appointmentId" : ["doctor"],
    "/api/appointments/doctor/:doctorId" : ["doctor"],

    "/api/availableSlots/:date" : ["patient"],
    "/api/availableSlot/getByDateTime" : ["patient"],
    "/api/availableSlot/doctor/:slotId" :["doctor"],
    "api/availableSlot" : ["doctor", "admin"],





};

module.exports = authorisedRoles;