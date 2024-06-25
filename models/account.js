const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Account {
    constructor(id, name, email, password, creationDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.creationDate = creationDate;
    }

    static async getAccountWithEmail(email) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * FROM Account a
            LEFT JOIN Patient p ON a.AccountId = p.PatientId
            LEFT JOIN Staff s ON a.AccountId = s.StaffId
            LEFT JOIN Doctor d ON a.AccountId = d.DoctorId
            LEFT JOIN Company c ON a.AccountId = c.CompanyId
            WHERE AccountEmail = @AccountEmail
        `;
        const request = connection.request();
        request.input('AccountEmail', email);

        const result = await request.query(query);
        connection.close();

        return result.recordset[0];
    }

    // Helper Function to get New ID
    static async getNextAccountId(accountConnection) {
        const query = `SELECT * FROM Account WHERE AccountId=(SELECT max(AccountId) FROM Account);`
        const request = accountConnection.request();

        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].AccountId);
    }

    static async deleteAccountById(accountId) {
        const query = `DELETE FROM Account WHERE AccountId = @AccountId`;
        const connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('AccountId', accountId);

        const result = await request.query(query);

        return result.rowsAffected[0] === 1;
    }

    static async updateAccount(accountId, updatedFields) {
        const allowedFields = {
            'name': 'AccountName',
            'email': 'AccountEmail',
            'password': 'AccountPassword',
        };
        
        if (updatedFields.length === 0) {
            throw new Error("No Fields to Update");
        }

        const connection = await sql.connect(dbConfig);
        const request = connection.request();
        
        // Populate Query with Updated Fields
        let query = `UPDATE Account SET `;
        for (const field in updatedFields) {
            if (Object.keys(allowedFields).includes(field) && updatedFields[field] !== null) {
                query += `${allowedFields[field]} = @${field}, `;
                request.input(field, updatedFields[field]);
            }
        }
        query = query.slice(0, -2); // Remove last ', '
        query += ` WHERE AccountId = '${accountId}'`;

        // Send Request
        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    //HERVIN
    static async adminUpdateAccount(accountId, updatedFields) {
        const allowedFields = {
            'name': 'AccountName',
            'creationDate': 'AccountCreationDate',
        };
        
        if (updatedFields.length === 0) {
            throw new Error("No Fields to Update");
        }

        const connection = await sql.connect(dbConfig);
        const request = connection.request();
        
        // Populate Query with Updated Fields
        let query = `UPDATE Account SET `;
        for (const field in updatedFields) {
            if (Object.keys(allowedFields).includes(field) && updatedFields[field] !== null) {
                query += `${allowedFields[field]} = @${field}, `;
                request.input(field, updatedFields[field]);
            }
        }
        query = query.slice(0, -2); // Remove last ', '
        query += ` WHERE AccountId = '${accountId}'`;

        // Send Request
        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }
}

module.exports = Account;