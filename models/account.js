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
            WHERE AccountEmail = '${email}'
        `;
        const request = connection.request();

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
}

// Subclasses of Account
class Patient extends Account {
    constructor(id, name, email, password, creationDate, knownAllergies, birthdate, isApproved) {
        super(id, name, email, password, creationDate);
        this.knownAllergies = knownAllergies;
        this.birthdate = birthdate;
        this.isApproved = isApproved;
    }

    static async createPatient(name, email, password, knownAllergies, birthdate) {
        const connection = await sql.connect(dbConfig);
        const newAccountId = await Account.getNextAccountId(connection);
        const insertUnixTime = Math.floor(Date.now() / 1000);

        const insertMemberQuery = `
            INSERT INTO Account (AccountId, AccountName, AccountEmail, AccountPassword, AccountCreationDate) VALUES
            ('${newAccountId}', '${name}', '${email}', '${password}', ${insertUnixTime});
        `
        const insertPatientQuery = `
            INSERT INTO Patient (PatientId, KnownAllergies, PatientBirthdate, PatientIsApproved) VALUES
            ('${newAccountId}', '${knownAllergies}', '${birthdate}', 'Pending');
        `;

        const request = connection.request();
        const insertMemberResult = await request.query(insertMemberQuery);
        const insertPatientResult = await request.query(insertPatientQuery);

        connection.close()

        return new Patient(newAccountId, name, email, password, insertUnixTime, knownAllergies, birthdate, "Pending");
    }

    static async getPatientById(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT * FROM Patient
            WHERE PatientId = '${patientId}'
        `;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        return result.recordset[0];
    }
}

class Staff extends Account {
    constructor(id, name, email, password, creationDate) {
        super(id, name, email, password, creationDate);
    }
}

class Doctor extends Account {
    constructor(id, name, email, password, creationDate, createdBy) {
        super(id, name, email, password, creationDate);
        this.createdBy = createdBy;
    }
}

class Company extends Account {
    constructor(id, name, email, password, creationDate, createdBy) {
        super(id, name, email, password, creationDate);
        this.createdBy = createdBy;
    }
}

module.exports = {
    Account,
    Patient,
    Staff,
    Doctor,
    Company,
};