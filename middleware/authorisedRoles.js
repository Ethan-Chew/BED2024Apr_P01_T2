const authorisedRoles = {
    "/api/patient/:patientId": ["patient"],
    "/api/patients/": ["patient", "admin"],
    "/api/patient/makePayment": ["patient"],
    "/api/mail/paymentConfirmation": ["patient"],
    "/api/patients/unapproved": ["admin"],
};

module.exports = authorisedRoles;