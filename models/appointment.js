const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Appointment {
    constructor(id, patientId, doctorId, slotId, consultationCost, reason, doctorNote) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.slotId = slotId;
        this.consultationCost = consultationCost;
        this.reason = reason;
        this.doctorNote = doctorNote;
    }

    // Helper Function to get New ID
    static async getNextAppointmentId(appointmentConnection) {
        const query = `SELECT * FROM Appointments WHERE AppointmentId=(SELECT max(AppointmentId) FROM Appointments);`
        const request = appointmentConnection.request();

        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].AppointmentId);
    }

    static async getAllPatientAppointment(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT a.*, avs.SlotDate, st.SlotTime FROM Appointments a
            LEFT JOIN AvailableSlot avs ON a.SlotId = avs.SlotId
            LEFT JOIN SlotTime st ON avs.SlotTimeId = st.SlotTimeId
            WHERE a.PatientId = '${patientId}'
        `
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset.map(
            appointment => new Appointment(appointment.AppointmentId, appointment.AccountId, appointment.DoctorId, appointment.SlotId, appointment.ConsultationCost, appointment.Reason, appointment.DoctorNote)
        );
    }

    static async getAppointmentDetail(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT a.*, pm.DrugName, pm.Quantity, pm.Reason AS 'DrugReason', pm.DrugRequest, di.DrugPrice * pm.Quantity AS 'DrugPrice' FROM Appointments a
            LEFT JOIN PrescribedMedication pm ON a.AppointmentId = pm.AppointmentId
            LEFT JOIN DrugInventory di ON pm.DrugName = di.DrugName
            WHERE a.AppointmentId = '${appointmentId}'
        `
        const request = connection.request();

        const result = await request.query(query);
        connection.close();
        
        if (!connection) return null;

        const appointmentWithMedication = {
            appointmentId: result.recordset[0].AppointmentId,
            patientId: result.recordset[0].PatientId,
            doctorId: result.recordset[0].DoctorId,
            slotId: result.recordset[0].SlotId,
            consultationCost: result.recordset[0].ConsultationCost,
            reason: result.recordset[0].Reason,
            doctorNote: result.recordset[0].DoctorNote,
            medication: []
        }

        for (const row of record.recordset) {
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

    static async createAppointment(patientId, slotId, reason) {
        const connection = await sql.connect(dbConfig);
        const newAppointmentId = await Appointment.getNextAppointmentId(connection);

        const query = `
            INSERT INTO Appointments (AppointmentId, AccountId, SlotId, Reason)
            VALUES ('${newAppointmentId}', '${patientId}', '${slotId}', '${reason}')
        `;
        const request = connection.request();

        await request.query(query);
        connection.close();

        return new Appointment(newAppointmentId, patientId, null, slotId, null, reason, null);
    }

    static async deleteAppointment(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM Appointments
            WHERE AppointmentId = '${appointmentId}'
        `;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected == 1;
    }
}

module.exports = Appointment;