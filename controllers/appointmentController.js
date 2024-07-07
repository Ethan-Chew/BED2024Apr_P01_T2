const appointment = require("../models/appointment");
const prescribedMedication = require("../models/prescribedMedication");
const payment = require("../models/payment");
const availableSlot = require("../models/availableSlot");
const slotTime = require("../models/slotTime");

// Created by: Ethan Chew
const getAllPatientAppointment = async (req, res) => {
    const { patientId } = req.params;

    try {
        if (req.user.id !== patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view appointments for this Patient."
            });
            return;
        }

        const appointments = await appointment.getAllPatientAppointment(patientId);

        if (!appointments) {
            res.status(404).json({
                status: "Not Found",
                message: `No appointments found for patient with ID ${patientId}`
            });
            return;
        }

        res.status(200).json({
            status: "Success",
            message: "Appointments Found",
            appointments: appointments
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

// Created By: Ethan Chew
const getAppointmentDetailById = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointmentDetail = await appointment.getAppointmentDetail(appointmentId);

        if (!appointmentDetail) {
            res.status(404).json({
                status: "Not Found",
                message: `Appointment with ID ${appointmentId} not found.`
            });
            return;
        }

        if (req.user.id !== appointmentDetail.patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view this appointment."
            });
            return;
        }

        res.status(200).json({
            status: "Success",
            message: `Appointment with ID: ${appointmentId} found`,
            appointment: appointmentDetail
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

// Created by: Ethan Chew
const deleteAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        // Ensure that the User is the Patient of the Appointment
        const appointmentDetail = await appointment.getAppointmentDetail(appointmentId);
        if (!appointmentDetail) {
            res.status(404).json({
                status: "Not Found",
                message: `Appointment with ID ${appointmentId} not found.`
            });
            return;
        }
        if (req.user.id !== appointmentDetail.patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to delete this appointment."
            });
            return;
        }

        await payment.removePayment(appointmentId);
        await prescribedMedication.removePrescribedMedication(appointmentId);
        await appointment.deleteAppointment(appointmentId);

        res.status(200).json({
            status: "Success",
            message: `Appointment with ID ${appointmentId} has been deleted.`
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

// Created by: Ethan Chew
const createAppointmentById = async (req, res) => {
    const { patientId, slotId, reason } = req.body;

    if (req.user.id !== patientId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to create an appointment for this Patient."
        });
        return;
    }
    
    try {
        const createAppointment = await appointment.createAppointment(patientId, slotId, reason);

        res.status(201).json({
            status: "Success", 
            message: `Appointment with ID ${createAppointment.id} has been created.`,
            appointment: createAppointment
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

// Created by: Ethan Chew
const updateAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;
    const { patientId, slotId, reason } = req.body;

    if (req.user.id !== patientId) {
        res.status(403).json({
            status: "Forbidden",
            message: "You are not allowed to update an appointment for this Patient."
        });
        return;
    }
    
    try {
        const updateAppointment = await appointment.updateAppointment(appointmentId, patientId, slotId, reason);

        res.status(200).json({
            status: "Success",
            message: `Appointment with ID ${appointmentId} has been updated.`,
            appointment: updateAppointment
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

const updateAppointmentDoctorSlot = async (req, res) => {
    try {
        // check if date and time slot for another already exists and is available
        // if does not exist then delete the appt and notify the patient

        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).send({ message: 'Appointment ID is required' });
        }

        const getAppointment = await appointment.getAppointmentDetail(appointmentId);
        const availableSlotId = await getAppointment.slotDate
        const getSlot = await availableSlot.updateAvailableSlot(availableSlotId, {
            doctor: doctorId,
            date: date,
            timeId: time,
        });
        const updateSlotDateTime = await availableSlot


    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const updateAppointmentNewDoctor = async (req, res) => {
    const { appointmentId } = req.params;

    try {

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getAllPatientAppointment,
    getAppointmentDetailById,
    deleteAppointmentById,
    createAppointmentById,
    getAppointmentDetailsByDoctorId,
    updateAppointmentById,
}