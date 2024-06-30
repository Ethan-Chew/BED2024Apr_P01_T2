const appointment = require("../models/appointment");
const prescribedMedication = require("../models/prescribedMedication");
const payment = require("../models/payment");

const getAllPatientAppointment = async (req, res) => {
    const { patientId } = req.params;

    try {
        const appointments = await appointment.getAllPatientAppointment(patientId);

        if (!appointments) {
            res.status(404).json({
                message: `No appointments found for patient with ID ${patientId}`
            });
            return;
        }

        res.status(200).json({
            message: "Appointments Found",
            appointments: appointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const getAppointmentDetailById = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointmentDetail = await appointment.getAppointmentDetail(appointmentId);

        if (!appointmentDetail) {
            res.status(404).json({
                message: `Appointment with ID ${appointmentId} not found.`
            });
            return;
        }

        res.status(200).json({
            message: `Appointment with ID: ${appointmentId} found`,
            appointment: appointmentDetail
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const deleteAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const deleteAppointment = await payment.removePayment(appointmentId);
        const deletePrescribedMedication = await prescribedMedication.removePrescribedMedication(appointmentId);
        const deleteConfirmation = await appointment.deleteAppointment(appointmentId);

        if (deleteConfirmation) {
            res.status(200).json({
                message: `Appointment with ID ${appointmentId} has been deleted.`
            });
            return;
        } else {
            res.status(500).json({
                message: `Failed to delete Appointment.`
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const getAppointmentDetailsByDoctorId = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const appointments = await appointment.getAllAppointmentDetailsByDoctorId(doctorId);

        if (!appointments) {
            res.status(404).json({
                message: `No appointments found for Doctor with ID ${doctorId}`
            });
            return;
        }

        res.status(200).json({
            message: "Appointments Found",
            appointments: appointments
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getAllPatientAppointment,
    getAppointmentDetailById,
    deleteAppointmentById,
    getAppointmentDetailsByDoctorId
}