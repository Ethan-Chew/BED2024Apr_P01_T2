const appointment = require("../models/appointment");
const prescribedMedication = require("../models/prescribedMedication");
const payment = require("../models/payment");
const availableSlot = require("../models/availableSlot");
const slotTime = require("../models/slotTime");
const notifications = require("../models/notifications");

// Created by: Ethan Chew
const getAllPatientAppointment = async (req, res) => {
    const { patientId } = req.params;

    try {
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
                message: `Appointment with ID ${appointmentId} not found.`
            });
            return;
        }

        if (req.user.id !== appointmentDetail.patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view this Appointment."
            });
            return;
        }

        res.status(200).json({
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

        if (!createAppointment) {
            res.status(500).json({
                message: `Failed to create Appointment.`
            });
            return;
        }

        res.status(201).json({
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

        if (!updateAppointment) {
            res.status(500).json({
                message: `Failed to update Appointment.`
            });
            return;
        }

        res.status(200).json({
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

// Emmanuel
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

// Emmanuel //
const updateAppointmentDoctorSlot = async (req, res) => {
    try {
        // check if date and time slot for another already exists and is available
        // if does not exist then delete the appt and notify the patient

        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const getAppointment = await appointment.getAppointmentDetail(appointmentId);
        const availableSlotId = await getAppointment.SlotTime;

        if (getAppointment.consultationCost === "NULL" || getAppointment.doctorNote === "NULL") {
            return res.status(405).json({ message: 'Appointment has already occured' });
        }
        const getAnotherAvailableSlot = await availableSlot.getAnotherAvailableSlot(getAppointment.doctorId, availableSlotId);

        if (!getAnotherAvailableSlot) {
            const message = "The doctor has cancelled your appointment and there are no other available timeslots";
            const deleteAppointment = await appointment.deleteAppointment(appointmentId); // ethan's model func
            const sendNotification = await notifications.createNotification(getAppointment.doctorId, getAppointment.patientId, message)

            return res.status(200).json({ message: `Appointment with ID ${appointmentId} has been deleted. Notification has been sent to the patient` });
        } else {
            const nextAvailableSlot = availableSlot.getAnotherAvailableSlot(getAppointment.doctorId, availableSlotId)

            const updateFields = {
                'doctor': nextAvailableSlot.doctorId,
                'slotId': nextAvailableSlot.slotId,
            }
            const updateAppointment = await appointment.updateAppointmentDoctorSlot(appointmentId, updateFields);
            const message = "The original doctor has cancelled your appointment, a new doctor will be seeing you instead";
            const sendNotification = await notifications.sendNotification(getAppointment.doctorId, getAppointment.patientId, message)

            return res.status(200).json({ message: `Appointment with ID ${appointmentId} has been updated. Notification has been sent to the patient` });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel //
const updateAppointmentNewDoctor = async (req, res) => {
    const { appointmentId } = req.params;

    if (!appointmentId) {
        return res.status(400).json({ message: 'Appointment ID is required' });
    }

    try {
        const s = appointment.updateAppointmentDoctorSlot();

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
    updateAppointmentDoctorSlot
}