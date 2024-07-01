const Payment = require("../models/payment");
const Appointment = require("../models/appointment");

// Created by: Ethan Chew
const patientMakePayment = async (req, res) => {
    try {
        const appointmentId = req.body.appointmentId;

        if (!appointmentId) {
            return res.status(400).json({ message: "Appointment ID is required." });
        }

        // Authorise the Payment by ensuring that the Patient ID in Appointment matches the Patient ID in the JWT
        const patientId = req.user.id;
        const appointment = await Appointment.getAppointmentDetail(appointmentId);

        if (appointment.patientId !== patientId) {
            return res.status(403).json({ message: "You are not allowed to make payment for this Appointment." });
        }

        // Update the Payment Status to Paid
        await Payment.updatePaymentStatus(appointmentId);

        res.status(200).json({ message: "Payment Successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    patientMakePayment
}