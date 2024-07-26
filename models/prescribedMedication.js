const sql = require("mssql");
const dbConfig = require("../dbConfig");

class PrescribedMedication {
    constructor(id, appointmentId, drugName, quantity, reason, drugRequest) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.drugName = drugName;
        this.quantity = quantity;
        this.reason = reason;
        this.drugRequest = drugRequest;

    }

    // Emmanuel
    static async updatePrescribedMedicationDrugRequestByAppointmentId(appointmentId, status) {
        const query = `
            UPDATE PrescribedMedication SET DrugRequest = @Status
            WHERE AppointmentId = @AppointmentId;
        `;

        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("AppointmentId", appointmentId);
        request.input("Status", status);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected == 1;
    }
}

module.exports = PrescribedMedication;