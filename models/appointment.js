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
    static async getNextAppointmentId() {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT * FROM Appointments WHERE AppointmentId=(SELECT max(AppointmentId) FROM Appointments);`
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].AppointmentId);
    }

    static async getAllPatientAppointment(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * FROM Appointments a
            WHERE a.AccountId = '${patientId}'
        `
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        return result.recordset.map(
            appointment => new Appointment(appointment.AppointmentId, appointment.AccountId, appointment.DoctorId, appointment.SlotId, appointment.ConsultationCost, appointment.Reason, appointment.DoctorNote)
        );
    }

    static async createAppointment(patientId, slotId, reason) {
        const connection = await sql.connect(dbConfig);
        const newAppointmentId = await Appointment.getNextAppointmentId();

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