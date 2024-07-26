const sql = require("mssql");
const dbConfig = require("../dbConfig");

class PaymentRequest {
    constructor(id, appointmentId, message, createdDate, status, amount) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.message = message;
        this.createdDate = createdDate;
        this.status = status;
        this.paidAmount = amount;
    }

    // Emmanuel
    // Helper function get New RequestId
    static async getNextRequestId(dbConnection) {
        const query = `
        SELECT * 
        FROM PaymentRequest
        WHERE PaymentRequestId =(SELECT max(PaymentRequestId) FROM PaymentRequest);
    `;
        const request = dbConnection.request();
        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].PaymentRequestId);
    }

    // Emmanuel 
    static async createPaymentRequest(appointmentId, message, createdDate) {
        const connection = await sql.connect(dbConfig);
        const newRequestId = await PaymentRequest.getNextRequestId(connection);
        const status = "Pending";

        const query = `
            INSERT INTO PaymentRequest (PaymentRequestId, AppointmentId, PaymentRequestMessage, PaymentRequestCreatedDate, PaymentRequestStatus)
            VALUES (@PaymentRequestId, @AppointmentId, @PaymentRequestMessage, @PaymentRequestCreatedDate, @PaymentRequestStatus)
        `;


        const request = connection.request();
        request.input('PaymentRequestId', newRequestId);
        request.input('AppointmentId', appointmentId);
        request.input('PaymentRequestMessage', message);
        request.input('PaymentRequestCreatedDate', createdDate);
        request.input('PaymentRequestStatus', status);

        await request.query(query);
        connection.close();

        return new PaymentRequest(newRequestId, appointmentId, message, createdDate, status);
    }

    // Emmanuel
    static async cancelPaymentRequestById(id) {
        let query = `
            DELETE FROM PaymentRequest 
            WHERE PaymentRequestId = @Id AND PaymentRequestStatus != @Status
        `;

        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("Id", id);
        request.input("Status", "Rejected");

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected == 1;
    }

    // Emmanuel
    static async getPaymentRequestById(id) {
        const query = ` 
            SELECT *
            FROM PaymentRequest
            WHERE PaymentRequestId = @Id
        `;

        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("Id", id);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset;
    }

    // Emmanuel
    static async getPaymentRequestsByStatus(status) {
        const query = ` 
            SELECT *
            FROM PaymentRequest
            WHERE PaymentRequestStatus = @Status
        `;


        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("Status", status);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset;
    }

    // Emmanuel
    static async getPaymentRequestsByApprovedStatus() {
        const query = ` 
            SELECT pr.*, a.ConsultationCost
            FROM PaymentRequest pr
            INNER JOIN Appointments a ON  pr.AppointmentId = a.AppointmentId
            INNER JOIN PrescribedMedication pm ON pr.AppointmentId = pm.AppointmentId
            WHERE pr.PaymentRequestStatus = 'Approved' AND a.ConsultationCost > pr.PaymentPaidAmount AND pm.DrugRequest = 'Cancelled';
        `;


        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("Status", "Approved");

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        // console.log(result.recordset);
        return result.recordset;
    }

    // Emmanuel
    static async getPaymentRequestByAppointmentId(id) {
        const query = ` 
            SELECT *
            FROM PaymentRequest
            WHERE AppointmentId = @Id
        `;

        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("Id", id);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset;
    }

    // Emmanuel
    static async getPaymentRequestsByPatientId(id) {
        const query = ` 
            SELECT pr.*
            FROM PaymentRequest pr
            INNER JOIN Appointments appt ON pr.AppointmentId = appt.AppointmentId
            INNER JOIN Patient p ON appt.PatientId = p.PatientId
            WHERE p.PatientId = @Id
        `;

        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input("Id", id);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset;
    }

    // Emmanuel
    static async updatePaymentRequestStatusByAppointmentId(apptId, status) {
        const query = `
            UPDATE PaymentRequest SET PaymentRequestStatus = @Status, PaymentPaidAmount = 0
            WHERE AppointmentId = @AppointmentId;
        `;
        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('Status', status)
        request.input('AppointmentId', apptId);


        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    // Emmanuel
    static async payPaymentRequestByRequestId(paymentRequestId, amount) {
        const query = `
            UPDATE PaymentRequest SET PaymentPaidAmount = @Amount + PaymentPaidAmount
            WHERE PaymentRequestId = @PaymentRequestId
        `;

        const connection = await sql.connect(dbConfig);

        const request = connection.request();
        request.input('Amount', amount)
        request.input('PaymentRequestId', paymentRequestId);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    static async getPaymentRequestsBeforeToday() {
        const query = ` 
        SELECT *
        FROM PaymentRequest
        WHERE PaymentRequestCreatedDate <= DATEADD(day, -3,  GETDATE());
    `;

        const connection = await sql.connect(dbConfig);
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset;
    }
}

module.exports = PaymentRequest;