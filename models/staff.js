const Account = require("./account");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Staff extends Account {
    constructor(id, name, email, password, creationDate) {
        super(id, name, email, password, creationDate);
    }

    // Emmanuel
    static async createStaff(name, email, password) {
        const connection = await sql.connect(dbConfig);
        const newAccountId = await Account.getNextAccountId(connection);
        const insertUnixTime = Math.floor(Date.now() / 1000);

        const insertAccountQuery = `
            INSERT INTO Account (AccountId, AccountName, AccountEmail, AccountPassword, AccountCreationDate) VALUES
            ('${newAccountId}', '${name}', '${email}', '${password}', ${insertUnixTime});
        `

        const insertStaffQuery = `
            INSERT INTO Staff (StaffId) VALUES
            (@StaffId)
        `;

        const request = connection.request();

        // Set Request Inputs
        request.input('AccountId', newAccountId);
        request.input('AccountName', name);
        request.input('AccountEmail', email);
        request.input('AccountPassword', password);
        request.input('AccountCreationDate', insertUnixTime);

        request.input('StaffId', newAccountId);

        await request.query(insertAccountQuery);
        await request.query(insertStaffQuery);

        connection.close()

        return new Staff(newAccountId, name, email, password, insertUnixTime);
    }

    // Emmanuel
    /* commented out because no use as of now + WIP
    static async getStaffById(staffId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT acc.*
            FROM Account acc
            LEFT JOIN Staff s ON acc.AccountId = s.StaffId
            WHERE s.staffId = @StaffId
        `;
        const request = connection.request();
        request.input('StaffId', staffId);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset.map(
            staff => new Staff(staff.StaffId, staff.)
        );
    }
    */

    // Emmanuel
    static async deleteStaffById(staffId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            DELETE FROM Staff
            WHERE StaffId = @StaffId
        `;
        const request = connection.request();
        request.input('StaffId', staffId);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }
}

module.exports = Staff;