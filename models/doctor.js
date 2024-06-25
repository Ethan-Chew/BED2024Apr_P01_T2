const Account = require("./account");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Doctor extends Account {
    constructor(id, name, email, password, creationDate, createdBy) {
        super(id, name, email, password, creationDate);
        this.createdBy = createdBy;
    }

    static async createPatient(name, email, password, createdBy) {
        const connection = await sql.connect(dbConfig);
        const newAccountId = await Account.getNextAccountId(connection);
        const insertUnixTime = Math.floor(Date.now() / 1000);
    
        const insertAccountQuery = `
        INSERT INTO Account (AccountId, AccountName, AccountEmail, AccountPassword, AccountCreationDate) VALUES
        ('${newAccountId}', '${name}', '${email}', '${password}', ${insertUnixTime});
    `
        const insertDoctorQuery = `
        INSERT INTO doctor (DoctorId, DoctorCreatedBy) VALUES
        ('${newAccountId}','${createdBy}')
        `

        const request = connection.request();

        // Set Request Inputs
        request.input('AccountId', newAccountId);
        request.input('AccountName', name);
        request.input('AccountEmail', email);
        request.input('AccountPassword', password);
        request.input('AccountCreationDate', insertUnixTime);

        request.input('DoctorId', newAccountId);
        request.input('DoctorCreatedBy',createdBy)


        await request.query(insertAccountQuery);
        await request.query(insertDoctorQuery);

        connection.close()

        return new Doctor(newAccountId, name, email, password, insertUnixTime, createdBy)
    }


}

module.exports = Doctor;