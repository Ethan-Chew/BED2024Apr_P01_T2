const authorisedRoles = {
    "/api/patient/:patientId": ["patient"],
    "/api/patients/": ["patient", "admin"],
    "/api/patient/makePayment": ["patient"],
    "/api/mail/paymentConfirmation": ["patient"],
    "/api/chatbot/history/:patientId": ["patient"],
};

module.exports = authorisedRoles;