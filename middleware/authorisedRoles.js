const authorisedRoles = {
    "/api/patient/:patientId": ["patient", "admin"],
    "/api/patients/": ["patient", "admin"],
    "/api/appointments/patient/:patientId": ["patient"],
    "/api/appointments/:appointmentId": ["patient"],
    "/api/patient/makePayment": ["patient"],
    "/api/mail/paymentConfirmation": ["patient"],
    "/api/patients/unapproved": ["admin"],
    "/api/chatbot/history/:patientId": ["patient"],
    "/api/patient/:patientId/paymentMethods": ["patient"],
    "/api/patient/:patientId/paymentMethods/:methodId": ["patient"],
};

module.exports = authorisedRoles;