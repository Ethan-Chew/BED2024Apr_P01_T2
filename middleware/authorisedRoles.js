const authorisedRoles = {
    "/api/patient/:patientId": ["patient", "admin"],
    "/api/patients/": ["patient", "admin"],
    "/api/appointments": ["patient"],
    "/api/appointments/patient/:patientId": ["patient"],
    "/api/appointments/:appointmentId": ["patient"],
    "/api/patient/makePayment": ["patient"],
    "/api/mail/paymentConfirmation": ["patient"],
    "/api/patients/unapproved": ["admin"],
    "/api/patient/:patientId/paymentMethods": ["patient"],
    "/api/patient/:patientId/paymentMethods/:methodId": ["patient"],
    "/api/chatbot/sendMessage": ["patient"],
    "/api/chatbot/history/:patientId": ["patient"],
    "/api/patient/:patientId/digitalWallet": ["patient"],
    "/api/patient/:patientId/digitalWalletHistory": ["patient"],
};

module.exports = authorisedRoles;