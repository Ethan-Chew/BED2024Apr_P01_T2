const sql = require("mssql");
const dbConfig = require("../dbConfig");

class PrescribedMedication {
    static async removePrescribedMedication(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM PrescribedMedication
            WHERE AppointmentId = @AppointmentId
        `;
        const request = connection.request();
        request.input('AppointmentId', appointmentId);

        await request.query(query);
        connection.close();
    }
}

module.exports = PrescribedMedication;