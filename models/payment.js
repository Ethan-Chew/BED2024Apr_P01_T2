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
    static async updatePaymentStatus(appointmentId, paymentType) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE Payments SET PaymentStatus = 'Paid', PaymentType = @PaymentType
            WHERE AppointmentId = @AppointmentId
        `
        const request = connection.request();
        request.input('AppointmentId', appointmentId);
        request.input('PaymentType', paymentType);

        await request.query(query);
        connection.close();
    }

    // Emmanuel
    static async updatePaymentStatusToPayRequest(appointmentId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE Payments p
            INNER JOIN PaymentRequest pr ON p.AppointmentId = pr.AppointmentId
            SET p.PaymentStatus = 'PayRequest'
            WHERE p.AppointmentId = @AppointmentId AND p.;
        `

        const query2 = 1;/*
        UPDATE Payments 
SET PaymentStatus = 'PayRequest'
FROM Payments p INNER JOIN PaymentRequest pr ON p.AppointmentId = pr.AppointmentId
*/
        const request = connection.request();
        request.input('AppointmentId', appointmentId);

        await request.query(query);
        connection.close();
    }
}

module.exports = Payment;