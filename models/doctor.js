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
    //HERVIN
    static async getAllDoctors() {
        const connection = await sql.connect(dbConfig);
        const query = `
            SELECT d.*, acc.AccountName, acc.AccountEmail, acc.AccountCreationDate FROM Doctor d
            LEFT JOIN Account acc ON acc.AccountId = d.DoctorId
        `;
        const result = await connection.query(query);
        connection.close();
    
        const doctors = result.recordset.map(doctor => ({
            name: doctor.AccountName,
            email: doctor.AccountEmail,
            doctorId: doctor.DoctorId,
            creationDate: new Date(doctor.AccountCreationDate * 1000).toISOString().split("T")[0],
        }));
    
        return doctors; // Return an array of doctor objects
    }
    //HERVIN
    static async getDoctorById(doctorId) {
        const connection = await sql.connect(dbConfig);
    
        const query = `
            SELECT d.*, acc.AccountName, acc.AccountEmail, acc.AccountCreationDate FROM Doctor d
            LEFT JOIN Account acc ON acc.AccountId = d.DoctorId
            WHERE d.DoctorId = @DoctorId
        `;
        const request = connection.request();
        request.input('DoctorId', doctorId);
    
        const result = await request.query(query);
        connection.close();
    
        // Group Doctor information
        const doctorInfo = {
            name: result.recordset[0].AccountName,
            email: result.recordset[0].AccountEmail,
            doctorId: result.recordset[0].DoctorId,
            creationDate: new Date(result.recordset[0].AccountCreationDate * 1000).toISOString().split("T")[0],
        };
    
        return doctorInfo;
    }
    //HERVIN
    static async updateDoctorById(doctorId, name, email, dateOfJoining) {
        const connection = await sql.connect(dbConfig);
    
        // Update Doctor table
        const updateDoctorQuery = `
            UPDATE Doctor SET
            DoctorId = @DoctorId
            WHERE DoctorId = @DoctorId
        `;
    
        const updateAccountQuery = `
            UPDATE Account SET
            AccountName = @name,
            AccountEmail = @Email,
            AccountCreationDate = @DateOfJoining
            WHERE AccountId = @DoctorId
        `;
    
        const request = connection.request();
    
        // Set Request Inputs
        request.input('DoctorId', doctorId);
        await request.query(updateDoctorQuery);
    
        request.input('name', name);
        request.input('Email', email);
        request.input('DateOfJoining', Math.floor(new Date(dateOfJoining).getTime() / 1000));
        await request.query(updateAccountQuery);
    
        connection.close();
    
        return { doctorId, name, email, dateOfJoining };
    }

    //HERVIN
    static async deleteDoctorById(doctorId) {
        const connection = await sql.connect(dbConfig);
    
        const query = `DELETE FROM Doctor WHERE DoctorId = @DoctorId`;
        const request = connection.request();
        request.input('DoctorId', doctorId);
    
        const deleteDoctorRes = await request.query(query);
    
        connection.close();
        return deleteDoctorRes.rowsAffected[0] === 1;
    }

}

module.exports = Doctor;