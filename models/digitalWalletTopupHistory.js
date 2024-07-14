const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DigitalWalletTopupHistory {
    constructor(id, patientId, amount, date) {
        this.id = id;
        this.patientId = patientId;
        this.amount = amount;
        this.date = date;
    }

    // Created By: Ethan Chew
    static async createTopupHistory(patientId, amount) {
        const connection = await sql.connect(dbConfig);

        const query = `
            INSERT INTO DigitalWalletTopupHistory (PatientId, TransactionAmount, TransactionDate)
            VALUES (@PatientId, @TransactionAmount, @TransactionDate);
            SELECT SCOPE_IDENTITY() AS id;
        `;

        const unixMs = Date.now();
        const request = connection.request();
        request.input('PatientId', patientId);
        request.input('TransactionAmount', amount);
        request.input('TransactionDate', unixMs);

        const result = await request.query(query);
        connection.close();

        return new DigitalWalletTopupHistory(patientId, result.recordset[0].id, amount, unixMs);
    }

    // Created By: Ethan Chew
    static async deleteAllTopupHistory(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM DigitalWalletTopupHistory
            WHERE PatientId = @PatientId
        `;

        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] >= 1;
    }
}

module.exports = DigitalWalletTopupHistory;