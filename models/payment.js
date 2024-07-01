const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Payment {
    constructor(id, appointmentId, amount, paymentDate, paymentStatus) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
    }

    // Created by: Ethan Chew
    static async updatePaymentStatus(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE Payments SET PaymentStatus = 'Paid'
            WHERE AppointmentId = @AppointmentId
        `
        const request = connection.request();
        request.input('AppointmentId', appointmentId);

        await request.query(query);
        connection.close();
    }

    // Created by: Ethan Chew
    static async removePayment(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM Payments
            WHERE AppointmentId = @AppointmentId
        `;
        const request = connection.request();
        request.input('AppointmentId', appointmentId);

        await request.query(query);
        connection.close();
    }
}

module.exports = Payment;