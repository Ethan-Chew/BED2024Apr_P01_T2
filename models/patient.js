const Account = require("./account");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Patient extends Account {
    constructor(id, name, email, password, creationDate, knownAllergies, birthdate, isApproved) {
        super(id, name, email, password, creationDate);
        this.knownAllergies = knownAllergies;
        this.birthdate = birthdate;
        this.isApproved = isApproved;
    }

    // Created by: Ethan Chew
    static async createPatient(name, email, password, knownAllergies, birthdate) {
        const connection = await sql.connect(dbConfig);
        const newAccountId = await Account.getNextAccountId(connection);
        const insertUnixTime = Math.floor(Date.now() / 1000);

        const insertMemberQuery = `
            INSERT INTO Account (AccountId, AccountName, AccountEmail, AccountPassword, AccountCreationDate) VALUES
            (@AccountId, @AccountName, @AccountEmail, @AccountPassword, @AccountCreationDate);
        `
        const insertPatientQuery = `
            INSERT INTO Patient (PatientId, KnownAllergies, PatientBirthdate, PatientIsApproved) VALUES
            (@PatientId, @KnownAllergies, @PatientBirthdate, @PatientIsApproved)
        `;

        const request = connection.request();

        // Set Request Inputs
        request.input('AccountId', newAccountId);
        request.input('AccountName', name);
        request.input('AccountEmail', email);
        request.input('AccountPassword', password);
        request.input('AccountCreationDate', insertUnixTime);

        request.input('PatientId', newAccountId);
        request.input('KnownAllergies', knownAllergies);
        request.input('PatientBirthdate', birthdate);
        request.input('PatientIsApproved', "Pending");

        await request.query(insertMemberQuery);
        await request.query(insertPatientQuery);

        connection.close()

        return new Patient(newAccountId, name, email, password, insertUnixTime, knownAllergies, birthdate, "Pending");
    }

    // Created by: Ethan Chew
    static async getPatientById(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT p.*, acc.AccountName, acc.AccountEmail, acc.AccountCreationDate, a.DoctorId, a.SlotId, a.AppointmentId FROM Patient p
            LEFT JOIN Account acc ON acc.AccountId = p.PatientId
            LEFT JOIN Appointments a ON a.PatientId = p.PatientId
            WHERE p.PatientId = @PatientId
        `;
        const request = connection.request();
        request.input('PatientId', patientId);

        const result = await request.query(query);
        connection.close();

        // Group Patients with their Associated Appointments
        const birthdate = new Date(result.recordset[0].PatientBirthdate).toISOString().split("T")[0];  // Remove time from date
        const patientsWithAppointmentIds = {
            name: result.recordset[0].AccountName,
            email: result.recordset[0].AccountEmail,
            birthdate: birthdate,
            patientId: result.recordset[0].PatientId,
            knownAllergies: result.recordset[0].KnownAllergies,
            isApproved: result.recordset[0].PatientIsApproved,
            creationDate: new Date(result.recordset[0].AccountCreationDate * 1000).toISOString().split("T")[0],
            appointmentIds: [],
        };
        for (const row of result.recordset) {
            patientsWithAppointmentIds.appointmentIds.push(row.AppointmentId);
        }

        return patientsWithAppointmentIds;
    }
    //HERVIn
    static async getAllPatient() {
        const connection = await sql.connect(dbConfig);
        const query = `
            SELECT p.*, acc.AccountName, acc.AccountEmail, acc.AccountCreationDate FROM Patient p
            LEFT JOIN Account acc ON acc.AccountId = p.PatientId
        `;
        const result = await connection.query(query);
        connection.close();
    
        const patients = result.recordset.map(patient => ({
            name: patient.AccountName,
            email: patient.AccountEmail,
            birthdate: new Date(patient.PatientBirthdate).toISOString().split("T")[0], // Process each patient's birthdate
            patientId: patient.PatientId,
            knownAllergies: patient.KnownAllergies,
            isApproved: patient.PatientIsApproved,
            creationDate: new Date(patient.AccountCreationDate * 1000).toISOString().split("T")[0],
        }));
    
        return patients; // Return an array of patient objects
    }
    //HERVIN
    static async getAllUnapproved() {
        const connection = await sql.connect(dbConfig);
        const query = `
            SELECT p.*, acc.AccountName, acc.AccountEmail, acc.AccountCreationDate 
            FROM Patient p
            LEFT JOIN Account acc ON acc.AccountId = p.PatientId
            WHERE p.PatientIsApproved = 'Pending'
        `;
        const result = await connection.query(query);
        connection.close();
    
        const patients = result.recordset.map(patient => ({
            name: patient.AccountName,
            email: patient.AccountEmail,
            birthdate: new Date(patient.PatientBirthdate).toISOString().split("T")[0], // Process each patient's birthdate
            patientId: patient.PatientId,
            knownAllergies: patient.KnownAllergies,
            isApproved: patient.PatientIsApproved,
            creationDate: new Date(patient.AccountCreationDate * 1000).toISOString().split("T")[0],
        }));
    
        return patients; // Return an array of patient objects
    }

    // Created by: Ethan Chew
    static async deletePatientById(patientId) {
        const connection = await sql.connect(dbConfig);

        const query = `DELETE FROM Patient WHERE PatientId = @PatientId`;
        const request = connection.request();
        request.input('PatientId', patientId);

        const deletePatientRes = await request.query(query);

        connection.close();
        return deletePatientRes.rowsAffected[0] === 1
    }
    
    // Created by: Ethan Chew
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
        query += ` WHERE PatientId = @PatientId`;
        request.input('PatientId', patientId);

        // Send Request
        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    //HERVIN
    static async adminUpdatePatient(patientId, updatedFields) {
        const allowedFields = {
            'knownAllergies': 'KnownAllergies',
            'birthDate': 'PatientBirthdate',
            'isApproved': 'PatientIsApproved',
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
        query += ` WHERE PatientId = @PatientId`;
        request.input('PatientId', patientId);
    
        // Send Request
        const result = await request.query(query);
        connection.close();
    
        return result.rowsAffected[0] === 1;
    }

}



module.exports = Patient;