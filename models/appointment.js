const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Appointment {
    constructor(id, patientId, doctorId, consultationCost, reason, doctorNote, slotDate, slotTime, paymentStatus) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.consultationCost = consultationCost;
        this.reason = reason;
        this.doctorNote = doctorNote;
        this.slotDate = slotDate;
        this.slotTime = slotTime;
        this.paymentStatus = paymentStatus;
    }

    // Helper Function to get New ID
    static async getNextAppointmentId(appointmentConnection) {
        const query = `SELECT * FROM Appointments WHERE AppointmentId=(SELECT max(AppointmentId) FROM Appointments);`
        const request = appointmentConnection.request();

        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].AppointmentId);
    }

    // Created by: Ethan Chew
    static async getAllPatientAppointment(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT a.*, avs.SlotDate, st.SlotTime, pay.PaymentStatus FROM Appointments a
            LEFT JOIN AvailableSlot avs ON a.SlotId = avs.SlotId
            LEFT JOIN SlotTime st ON avs.SlotTimeId = st.SlotTimeId
            LEFT JOIN Payments pay ON pay.AppointmentId = a.AppointmentId
            WHERE a.PatientId = @PatientId
        `
        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;
        return result.recordset.map(
            appointment => new Appointment(appointment.AppointmentId, appointment.PatientId, appointment.DoctorId, appointment.ConsultationCost, appointment.Reason, appointment.DoctorNote, appointment.SlotDate, appointment.SlotTime, appointment.PaymentStatus)
        );
    }

    // Created by: Ethan Chew
    static async getAppointmentDetail(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT a.AppointmentId, a.ConsultationCost, a.PatientId, a.DoctorId, a.Reason, avs.SlotDate, st.SlotTime, pay.PaymentStatus, pay.PaymentType, payReq.PaymentRequestId, payReq.PaymentRequestMessage, payReq.PaymentRequestCreatedDate, payReq.PaymentRequestStatus, payReq.PaymentPaidAmount, pm.DrugName, pm.Quantity, pm.Reason AS 'DrugReason', pm.DrugRequest, di.DrugPrice * pm.Quantity AS 'DrugPrice' FROM Appointments a
            LEFT JOIN Payments pay ON pay.AppointmentId = a.AppointmentId
            LEFT JOIN PaymentRequest payReq ON payReq.AppointmentId = a.AppointmentId
            LEFT JOIN PrescribedMedication pm ON a.AppointmentId = pm.AppointmentId
            LEFT JOIN DrugInventory di ON pm.DrugName = di.DrugName
            LEFT JOIN AvailableSlot avs ON avs.SlotId = a.SlotId
            LEFT JOIN SlotTime st ON st.SlotTimeId = avs.SlotTimeId
            WHERE a.AppointmentId = @AppointmentId
        `
        const request = connection.request();
        request.input('AppointmentId', appointmentId);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        const paymentRequest = firstRow.PaymentRequestStatus ? {
            id: firstRow.PaymentRequestId,
            requestMessage: firstRow.PaymentRequestMessage,
            createdDate: firstRow.PaymentRequestCreatedDate,
            status: firstRow.PaymentRequestStatus,
            helpAmount: firstRow.PaymentPaidAmount
        } : null;

        const appointmentWithMedication = {
            appointmentId: result.recordset[0].AppointmentId,
            patientId: result.recordset[0].PatientId,
            doctorId: result.recordset[0].DoctorId,
            slotDate: result.recordset[0].SlotDate,
            slotTime: result.recordset[0].SlotTime,
            consultationCost: result.recordset[0].ConsultationCost,
            reason: result.recordset[0].Reason,
            doctorNote: result.recordset[0].DoctorNote,
            paymentStatus: result.recordset[0].PaymentStatus,
            paymentType: result.recordset[0].PaymentType,
            paymentRequest: paymentRequest,
            medication: [],
        }

        for (const row of result.recordset) {
            appointmentWithMedication.medication.push({
                drugName: row.DrugName,
                quantity: row.Quantity,
                drugReason: row.DrugReason,
                drugRequest: row.DrugRequest,
                drugPrice: row.DrugPrice
            });
        }

        return appointmentWithMedication;
    }

    // Created By: Ethan Chew
    static async createAppointment(patientId, slotId, reason) {
        const connection = await sql.connect(dbConfig);
        const newAppointmentId = await Appointment.getNextAppointmentId(connection);

        const query = `
            INSERT INTO Appointments (AppointmentId, PatientId, SlotId, Reason)
            VALUES (@AppointmentId, @PatientId, @SlotId, @Reason)
        `;
        const request = connection.request();
        request.input('AppointmentId', newAppointmentId);
        request.input('PatientId', patientId);
        request.input('SlotId', slotId);
        request.input('Reason', reason);

        await request.query(query);
        connection.close();

        return this.getAppointmentDetail(newAppointmentId);
    }

    // Created by: Ethan Chew
    static async deleteAppointment(appointmentId) {
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);

        try {
            await transaction.begin();

            // Delete Payments Associated to the Appointment
            const deletePaymentsQuery = `DELETE FROM Payments WHERE AppointmentId = @AppointmentId`;
            const deletePaymentsRequest = new sql.Request(transaction);
            deletePaymentsRequest.input('AppointmentId', appointmentId);
            await deletePaymentsRequest.query(deletePaymentsQuery);

            // Delete Payment Requests Associated to the Appointment
            const deletePaymentRequestsQuery = `DELETE FROM PaymentRequest WHERE AppointmentId = @AppointmentId`;
            const deletePaymentRequestsRequest = new sql.Request(transaction);
            deletePaymentRequestsRequest.input('AppointmentId', appointmentId);
            await deletePaymentRequestsRequest.query(deletePaymentRequestsQuery);

            // Delete DrugRequestContributions
            const deleteDrugRequestContributionsQuery = `DELETE FROM DrugRequestContribution WHERE AppointmentId = @AppointmentId`;
            const deleteDrugRequestContributionsRequest = new sql.Request(transaction);
            deleteDrugRequestContributionsRequest.input('AppointmentId', appointmentId);
            await deleteDrugRequestContributionsRequest.query(deleteDrugRequestContributionsQuery);

            // Delete Prescribed Medication
            const deletePrescribedMedicationQuery = `DELETE FROM PrescribedMedication WHERE AppointmentId = @AppointmentId`;
            const deletePrescribedMedicationRequest = new sql.Request(transaction);
            deletePrescribedMedicationRequest.input('AppointmentId', appointmentId);
            await deletePrescribedMedicationRequest.query(deletePrescribedMedicationQuery);

            // Delete the Appointment itself
            const deleteAppointmentQuery = `DELETE FROM Appointments WHERE AppointmentId = @AppointmentId`;
            const deleteAppointmentRequest = new sql.Request(transaction);
            deleteAppointmentRequest.input('AppointmentId', appointmentId);
            const deleteAppointmentResult = await deleteAppointmentRequest.query(deleteAppointmentQuery);
            if (deleteAppointmentResult.rowsAffected[0] !== 1) {
                throw new Error("Failed to delete Appointment");
            }

            // Send and Close the Transaction
            await transaction.commit();
            connection.close();

            return true;
        } catch (err) {
            await transaction.rollback();
            connection.close();
            throw err;
        }
    }

    // Created by: Ethan Chew
    static async updateAppointment(appointmentId, patientId, slotId, reason) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE Appointments
            SET PatientId = @PatientId, SlotId = @SlotId, Reason = @Reason
            WHERE AppointmentId = @AppointmentId
        `;
        const request = connection.request();
        request.input('AppointmentId', appointmentId);
        request.input('PatientId', patientId);
        request.input('SlotId', slotId);
        request.input('Reason', reason);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected == 1;
    }

    // Emmanuel
    static async getAllAppointmentDetailsByDoctorId(doctorId) {
        const connection = await sql.connect(dbConfig);

        const query = `
        SELECT a.*, avs.SlotDate, st.SlotTime 
        FROM Appointments a
        LEFT JOIN AvailableSlot avs ON a.SlotId = avs.SlotId
        LEFT JOIN SlotTime st ON avs.SlotTimeId = st.SlotTimeId
        WHERE a.DoctorId = 'ACC0008';
        `;
        const request = connection.request();
        request.input('DoctorId', doctorId)

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset;
    }

    // Emmanuel
    // requires controller to handle finding an existing/create a new slotId
    static async updateAppointmentDoctorSlot(appointmentId, updatedFields) {
        const allowedFields = {
            'doctor': 'DoctorId',
            'slotId': 'SlotId',
        }

        if (updatedFields.length === 0) {
            throw new Error("No Fields to Update");
        }

        const connection = await sql.connect(dbConfig);
        const request = connection.request();

        let query = `UPDATE Appointment SET `;
        for (const field in updatedFields) {
            if (Object.keys(allowedFields).includes(field) && updatedFields[field] !== null) {
                query += `${allowedFields[field]} = @${field}, `;
                request.input(field, updatedFields[field]);
            }
        }
        query = query.slice(0, -2); // Remove last ', '
        query += ` WHERE AppointmentId = '${appointmentId}'`;

        // Send Request
        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

}

module.exports = Appointment;