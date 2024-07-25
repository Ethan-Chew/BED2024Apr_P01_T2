const Appointment = require("../models/appointment");
const AvailableSlot = require("../models/availableSlot");
const Notifications = require("../models/notifications");

// Created by: Ethan Chew
const getAllPatientAppointment = async (req, res) => {
    const { patientId } = req.params;

    try {
        if (req.user.id !== patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view this Appointment."
            });
            return;
        }
        
        const appointments = await Appointment.getAllPatientAppointment(patientId);
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
        const appointmentDetail = await Appointment.getAppointmentDetail(appointmentId);

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
        const getAppointment = await Appointment.getAppointmentDetail(appointmentId);

        if (!getAppointment) {
            res.status(404).json({
                status: "Not Found",
                message: `Appointment with ID ${appointmentId} not found.`
            });
        } else {
            console.log(req.user)
            if (req.user.id !== getAppointment.patientId) {
                res.status(403).json({
                    status: "Forbidden",
                    message: "You are not allowed to delete this Appointment."
                });
                return;
            }
        }

        const deleteConfirmation = await Appointment.deleteAppointment(appointmentId);

        if (deleteConfirmation) {
            res.status(200).json({
                status: "Success",
                message: `Appointment with ID ${appointmentId} has been deleted.`
            });
            return;
        } else {
            res.status(500).json({
                status: "Error",
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
        const createAppointment = await Appointment.createAppointment(patientId, slotId, reason);

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
        const updateAppointment = await Appointment.updateAppointment(appointmentId, patientId, slotId, reason);

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
        const appointments = await Appointment.getAllAppointmentDetailsByDoctorId(doctorId);

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

        const getAppointment = await Appointment.getAppointmentDetail(appointmentId); // ethan's model func
        const apptAvailableSlot = await AvailableSlot.getAvailableSlotByDateAndTime(getAppointment.slotDate, getAppointment.slotTime)

        
        
        if (getAppointment.consultationCost !== null) {
            return res.status(405).json({ message: 'Appointment has already occured' });
        }
        console.log("doctorId ", getAppointment.doctorId);

        const getAnotherAvailableSlot = await AvailableSlot.getAnotherAvailableSlot(getAppointment.doctorId, apptAvailableSlot.slotId);

        console.log("available Slot ", getAnotherAvailableSlot);


        if (!getAnotherAvailableSlot) {
            const message = "The doctor has cancelled your appointment and there are no other available timeslots";
            const deleteAppointment = await Appointment.deleteAppointment(appointmentId); // ethan's model func
            const sendNotification = await Notifications.createNotification(getAppointment.doctorId, getAppointment.patientId, message)

            return res.status(200).json({ message: `Appointment with ID ${appointmentId} has been deleted. Notification has been sent to the patient` });
        } else {
            const nextAvailableSlot = AvailableSlot.getAnotherAvailableSlot(getAppointment.doctorId, availableSlotId)

            const updateFields = {
                'doctor': nextAvailableSlot.doctorId,
                'slotId': nextAvailableSlot.slotId,
            }
            const updateAppointment = await Appointment.updateAppointmentDoctorSlot(appointmentId, updateFields);
            const message = "The original doctor has cancelled your appointment, a new doctor will be seeing you instead";
            const sendNotification = await Notifications.sendNotification(getAppointment.doctorId, getAppointment.patientId, message)

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
        const s = Appointment.updateAppointmentDoctorSlot();

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