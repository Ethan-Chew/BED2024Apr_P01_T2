const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { all } = require("axios");

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

    static async deleteAccountWithId(accountId, connection) {
        const query = `DELETE FROM Account WHERE AccountId = '${accountId}'`;
        const request = connection.request();

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
        await request.query(insertMemberQuery);
        await request.query(insertPatientQuery);

        connection.close()

        return new Patient(newAccountId, name, email, password, insertUnixTime, knownAllergies, birthdate, "Pending");
    }

    static async getPatientById(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT p.*, acc.AccountName, acc.AccountEmail, a.DoctorId, a.SlotId, a.AppointmentId, a.ConsultationCost, a.Reason, a.DoctorNote, pay.PaymentAmount, pay.PaymentStatus, s.SlotDate, st.SlotTime FROM Patient p
            LEFT JOIN Account acc ON acc.AccountId = p.PatientId
            LEFT JOIN Appointments a ON a.PatientId = p.PatientId
            LEFT JOIN Payments pay ON pay.AppointmentId = a.AppointmentId
            LEFT JOIN AvailableSlot s ON s.SlotId = a.SlotId
            LEFT JOIN SlotTime st ON st.SlotTimeId = s.SlotTimeId
            WHERE p.PatientId = '${patientId}'
        `;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        // Group Patients with their Associated Appointments
        const birthdate = new Date(result.recordset[0].PatientBirthdate).toISOString().split("T")[0];  // Remove time from date
        const patientsWithAppointments = {
            name: result.recordset[0].AccountName,
            email: result.recordset[0].AccountEmail,
            birthdate: birthdate,
            patientId: result.recordset[0].PatientId,
            knownAllergies: result.recordset[0].KnownAllergies,
            isApproved: result.recordset[0].PatientIsApproved,
            appointments: [],
        };
        for (const row of result.recordset) {
            patientsWithAppointments.appointments.push({
                appointmentId: row.AppointmentId,
                doctorId: row.DoctorId,
                slotId: row.SlotId,
                consultationCost: row.ConsultationCost,
                reason: row.Reason,
                doctorNote: row.DoctorNote,
                paymentAmount: row.PaymentAmount,
                paymentStatus: row.PaymentStatus,
                slotDate: row.SlotDate,
                slotTime: row.SlotTime,
            });
        }

        return patientsWithAppointments;
    }

    static async deletePatientById(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `DELETE FROM Patient WHERE PatientId = '${patientId}'`;
        const request = connection.request();

        const deletePatientRes = await request.query(query);
        const deleteAccountRes = await Account.deleteAccountWithId(patientId, connection);

        connection.close();
        return deleteAccountRes && deletePatientRes.rowsAffected[0] === 1
    }

    static async updatePatient(patientId, updatedFields) {
        const allowedFields = {
            'knownAllergies': 'KnownAllergies',
            'birthDate': 'PatientBirthdate',
        }
        
        if (updatedFields.length === 0) {
            throw new Error("No Fields to Update");
        }

        const connection = await sql.connect(dbConfig);
        const request = connection.request();
        
        // Populate Query with Updated Fields
        let query = `UPDATE Patient SET `;
        for (const field in updatedFields) {
            if (Object.keys(allowedFields).includes(field) && updatedFields[field] !== null) {
                query += `${allowedFields[field]} = @${field}, `;
                request.input(field, updatedFields[field]);
            }
        }
        query = query.slice(0, -2); // Remove last ', '
        query += ` WHERE PatientId = '${patientId}'`;
        console.log(query)

        // Send Request
        const result = await request.query(query);
        console.log(result)
        connection.close();

        return result.rowsAffected[0] === 1;
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