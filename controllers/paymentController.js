const Payment = require("../models/payment");
const Appointment = require("../models/appointment");

// Created by: Ethan Chew
const patientMakePayment = async (req, res) => {
    try {
        const { appointmentId, paymentMethod } = req.body;
        // Authorise the Payment by ensuring that the Patient ID in Appointment matches the Patient ID in the JWT
        const patientId = req.user.id;
        const appointment = await Appointment.getAppointmentDetail(appointmentId);

        if (appointment.patientId !== patientId) {
            return res.status(403).json({ 
                status: "Forbidden",
                message: "You are not allowed to make payment for this Appointment." 
            });
        }

        // Update the Payment Status to Paid
        await Payment.updatePaymentStatus(appointmentId, paymentMethod);

        res.status(200).json({ 
            status: "Success",
            message: "Payment Successful"
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

module.exports = {
    patientMakePayment
}