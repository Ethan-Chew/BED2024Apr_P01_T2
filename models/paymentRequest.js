const sql = require("mssql");
const dbConfig = require("../dbConfig");

class PaymentRequest {
    constructor(id, appointmentId, message, createdDate, status) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.message = message;
        this.createdDate = createdDate;
        this.status = status;

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
}

module.exports = PaymentRequest;