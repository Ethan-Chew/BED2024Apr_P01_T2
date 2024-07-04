const authorisedRoles = {
    "/api/patient/:patientId": ["patient", "admin"],
    "/api/patients/": ["patient", "admin"],
    "/api/patient/makePayment": ["patient"],
    "/api/mail/paymentConfirmation": ["patient"],
    "/api/patients/unapproved": ["admin"],
    "/api/chatbot/history/:patientId": ["patient"],
};

module.exports = authorisedRoles;