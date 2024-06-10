class Payment {
    constructor(id, appointmentId, amount, paymentDate, paymentStatus) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
    }

    // Get the Next Payment Id
    static async getNextPaymentId() {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT * FROM Payments WHERE PaymentId=(SELECT max(PaymentId) FROM Payments);`
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].PaymentId);
    }

    static async getPatientPayment(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * FROM Appointments a
            LEFT JOIN Payments p ON p.AppointmentId = a.AppointmentId
            WHERE a.AccountId = '${patientId}'
        `;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        return result.recordset.map(
            payment => new Payment(payment.PaymentId, payment.AppointmentId, payment.PaymentAmount, payment.PaymentStatus)
        );
    }

    static async createPayment(appointmentId, amount) {
        const connection = await sql.connect(dbConfig);
        const newPaymentId = await Payment.getNextPaymentId();

        const query = `
            INSERT INTO Payments (PaymentId, AppointmentId, PaymentAmount, PaymentStatus)
            VALUES ('${newPaymentId}', '${appointmentId}', '${amount}', 'Unpaid')
        `;
        const request = connection.request();

        await request.query(query);
        connection.close();

        return new Payment(newPaymentId, appointmentId, amount, "Unpaid");
    }
}