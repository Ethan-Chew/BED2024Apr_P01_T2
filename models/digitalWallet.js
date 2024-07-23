const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DigitalWallet {
    constructor(patientId, balance) {
        this.patientId = patientId;
        this.balance = balance;
    }

    // Created By: Ethan Chew
    static async getDigitalWalletByPatient(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT wallet.WalletBalance, his.* FROM DigitalWallet wallet
            LEFT JOIN DigitalWalletHistory his ON wallet.PatientId = his.PatientId
            WHERE wallet.PatientId = @PatientId
        `;

        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length === 0) return null;

        const wallet = {
            patientId: result.recordset[0].PatientId,
            balance: result.recordset[0].WalletBalance,
            transactionHistory: []
        };

        for (let i = 0; i < result.recordset.length; i++) {
            if (!(result.recordset[i].TransactionTitle === null)) {
                wallet.transactionHistory.push({
                    title: result.recordset[i].TransactionTitle,
                    amount: result.recordset[i].TransactionAmount,
                    date: result.recordset[i].TransactionDate
                });
            }
        }

        return wallet;
    }

    // Created By: Ethan Chew
    static async createDigitalWallet(patientId, initialBalance) {
        const connection = await sql.connect(dbConfig);

        const query = `
            INSERT INTO DigitalWallet (PatientId, WalletBalance)
            VALUES (@PatientId, @WalletBalance)
        `;

        const request = connection.request();
        request.input('PatientId', patientId);
        request.input('WalletBalance', initialBalance);

        await request.query(query);
        connection.close();

        return this.getDigitalWalletByPatient(patientId);
    }

    // Created By: Ethan Chew
    static async updateDigitalWallet(patientId, updatedBalance) {
        const connection = await sql.connect(dbConfig);

        const query = `
            UPDATE DigitalWallet
            SET WalletBalance = @WalletBalance
            WHERE PatientId = @PatientId
        `;

        const request = connection.request();
        request.input('PatientId', patientId);
        request.input('WalletBalance', updatedBalance);

        const updateRequest = await request.query(query);
        connection.close();

        return updateRequest.rowsAffected[0] === 1;
    }

    // Created By: Ethan Chew
    static async deleteDigitalWallet(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM DigitalWallet
            WHERE PatientId = @PatientId
        `;

        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] > 0;
    }
}

module.exports = DigitalWallet;