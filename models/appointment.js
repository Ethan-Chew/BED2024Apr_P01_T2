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
            SELECT a.AppointmentId, a.ConsultationCost, a.PatientId, a.DoctorId, a.Reason, avs.SlotDate, st.SlotTime, pay.PaymentStatus, payReq.PaymentRequestMessage, payReq.PaymentRequestCreatedDate, payReq.PaymentRequestStatus, pm.DrugName, pm.Quantity, pm.Reason AS 'DrugReason', pm.DrugRequest, di.DrugPrice * pm.Quantity AS 'DrugPrice' FROM Appointments a
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

        let paymentRequest = null;
        if (result.recordset[0].PaymentRequestStatus) {
            paymentRequest = {
                requestMessage: result.recordset[0].PaymentRequestMessage,
                createdDate: result.recordset[0].PaymentRequestCreatedDate,
                status: result.recordset[0].PaymentRequestStatus
            }
        }

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
        // const connection = await sql.connect(dbConfig);
        // const newAppointmentId = await Appointment.getNextAppointmentId(connection);

        // const query = `
        //     INSERT INTO Appointments (AppointmentId, AccountId, SlotId, Reason)
        //     VALUES (@AppointmentId, @AccountId, @SlotId, @Reason)
        // `;
        // const request = connection.request();
        // request.input('AppointmentId', newAppointmentId);
        // request.input('AccountId', patientId);
        // request.input('SlotId', slotId);
        // request.input('Reason', reason);

        // await request.query(query);
        // connection.close();

        // return new Appointment(newAppointmentId, patientId, null, slotId, null, reason, null);
    }

    static async deleteAppointment(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM Appointments
            WHERE AppointmentId = @AppointmentId
        `;
        const request = connection.request();
        request.input('AppointmentId', appointmentId);

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