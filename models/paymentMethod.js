class PaymentMethod {
    constructor (patientId, merchant, cardName, cardNumber, cardExpiryDate) {
        this.patientId = patientId;
        this.merchant = merchant;
        this.cardName = cardName;
        this.cardNumber = cardNumber;
        this.cardExpiryDate = cardExpiryDate;
    }

    static async getPaymentMethodsByPatientId(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * FROM PatientPaymentMethods
            WHERE PatientId = @PatientId
        `;
        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        return result.recordset.map((row) => new PaymentMethod(row.PatientId, row.Merchant, row.CardName, row.CardNumber, row.CardExpiryDate));
    }

    static async createPaymentMethodsForPatientId(patientId, merchant, cardName, cardNumber, cardExpiryDate) {
        const connection = await sql.connect(dbConfig);

        const insertQuery = `
            INSERT INTO PatientPaymentMethods (PatientId, Merchant, CardName, CardNumber, CardExpiryDate) VALUES
            (@PatientId, @Merchant, @CardName, @CardNumber, @CardExpiryDate),
        `;

        const request = connection.request();
        // Insert Data into Query
        request.input('PatientId', patientId);
        request.input('Merchant', merchant);
        request.input('CardName', cardName);
        request.input('CardNumber', cardNumber);
        request.input('CardExpiryDate', cardExpiryDate);

        await request.query(insertQuery);
        connection.close();

        return true;
    }

    static async deletePaymentMethod(patientId, cardNumber) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM PatientPaymentMethods
            WHERE PatientId = @PatientId AND CardNumber = @CardNumber
        `;
        const request = connection.request();
        request.input('PatientId', patientId);
        request.input('CardNumber', cardNumber);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    // TODO: Add Update Function
}