const sql = require("mssql");
const dbConfig = require("../dbConfig");

class PaymentMethod {
    constructor (id, patientId, merchant, cardName, cardNumber, cardExpiryDate) {
        this.id = id;
        this.patientId = patientId;
        this.merchant = merchant;
        this.cardName = cardName;
        this.cardNumber = cardNumber;
        this.cardExpiryDate = cardExpiryDate;
    }

    // Helper Function to get New ID -- Created by: Ethan Chew
    static async getNextPaymentMethodId(accountConnection) {
        const query = `SELECT * FROM PatientPaymentMethods WHERE PaymentMethodId=(SELECT max(PaymentMethodId) FROM PatientPaymentMethods);`
        const request = accountConnection.request();

        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].PaymentMethodId);
    }

    // Created by: Ethan Chew
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

        if (result.recordset.length === 0) return null;

        return result.recordset.map((row) => new PaymentMethod(row.PaymentMethodId, row.PatientId, row.Merchant, row.CardName, row.CardNumber, row.CardExpiryDate));
    }

    // Created by: Ethan Chew
    static async getPaymentMethodById(id) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * FROM PatientPaymentMethods
            WHERE PaymentMethodId = @PaymentMethodId
        `;
        const request = connection.request();
        request.input('PaymentMethodId', id);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length === 0) return null;

        const row = result.recordset[0];
        return new PaymentMethod(row.PaymentMethodId, row.PatientId, row.Merchant, row.CardName, row.CardNumber, row.CardExpiryDate);
    }

    // Created by: Ethan Chew
    static async createPaymentMethod(patientId, merchant, cardName, cardNumber, cardExpiryDate) {
        const connection = await sql.connect(dbConfig);
        const newId = await PaymentMethod.getNextPaymentMethodId(connection);

        const insertQuery = `
            INSERT INTO PatientPaymentMethods (PaymentMethodId, PatientId, Merchant, CardName, CardNumber, CardExpiryDate) VALUES
            (@PaymentMethodId, @PatientId, @Merchant, @CardName, @CardNumber, @CardExpiryDate);
        `;

        const request = connection.request();
        // Insert Data into Query
        request.input('PaymentMethodId', newId);
        request.input('PatientId', patientId);
        request.input('Merchant', merchant);
        request.input('CardName', cardName);
        request.input('CardNumber', cardNumber);
        request.input('CardExpiryDate', cardExpiryDate + "-01");

        await request.query(insertQuery);
        connection.close();

        return new PaymentMethod(newId, patientId, merchant, cardName, cardNumber, cardExpiryDate);
    }

    // Created by: Ethan Chew
    static async deletePaymentMethod(id) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM PatientPaymentMethods
            WHERE PaymentMethodId = @PaymentMethodId
        `;
        const request = connection.request();
        request.input('PaymentMethodId', id);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    // Created by: Ethan Chew
    static async deleteAllPaymentMethod(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM PatientPaymentMethods
            WHERE PatientId = @PatientId
        `;
        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] >= 1;
    }

    // Created by: Ethan Chew
    static async updatePaymentMethod(id, patientId, merchant, cardName, cardNumber, cardExpiryDate) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE PatientPaymentMethods
            SET Merchant = @Merchant, CardName = @CardName, CardExpiryDate = @CardExpiryDate, CardNumber = @CardNumber
            WHERE PaymentMethodId = @PaymentMethodId
        `;
        const request = connection.request();
        request.input('PaymentMethodId', id);
        request.input('PatientId', patientId);
        request.input('Merchant', merchant);
        request.input('CardName', cardName);
        request.input('CardNumber', cardNumber);
        request.input('CardExpiryDate', cardExpiryDate + "-01");

        await request.query(query);
        connection.close();

        return new PaymentMethod(id, patientId, merchant, cardName, cardNumber, cardExpiryDate);
    }
}

module.exports = PaymentMethod;