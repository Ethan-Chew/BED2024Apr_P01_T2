const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DigitalWalletHistory {
    constructor(id, patientId, amount, date) {
        this.id = id;
        this.patientId = patientId;
        this.amount = amount;
        this.date = date;
    }

    // Created By: Ethan Chew
    static async getDigitalWalletHistoryByPatient(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * FROM DigitalWalletHistory
            WHERE PatientId = @PatientId
        `;

        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        return result.recordset.map(record => 
            new DigitalWalletHistory(record.Id, record.PatientId, record.TransactionAmount, record.TransactionDate)
        );
    }

    // Created By: Ethan Chew
    static async createHistory(patientId, amount) {
        const connection = await sql.connect(dbConfig);

        const query = `
            INSERT INTO DigitalWalletHistory (PatientId, TransactionAmount, TransactionDate)
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

        return new DigitalWalletHistory(patientId, result.recordset[0].id, amount, unixMs);
    }

    // Created By: Ethan Chew
    static async deleteAllHistory(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM DigitalWalletHistory
            WHERE PatientId = @PatientId
        `;

        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] >= 1;
    }
}

module.exports = DigitalWalletHistory;