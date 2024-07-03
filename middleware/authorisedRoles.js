const authorisedRoles = {
    "/api/patient/:patientId": ["patient"],
    "/api/patients/": ["patient", "admin"],
    "/api/patient/makePayment": ["patient"],
    "/api/mail/paymentConfirmation": ["patient"],
};

module.exports = authorisedRoles;