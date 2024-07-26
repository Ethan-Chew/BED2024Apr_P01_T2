const sql = require("mssql");
const dbConfig = require("../dbConfig");

class AvailableSlot {
    constructor(slotId, doctorId, slotDate, slotTimeId) {
        this.slotId = slotId;
        this.doctorId = doctorId;
        this.slotDate = slotDate;
        this.slotTimeId = slotTimeId;
    }

    // Emmanuel
    // Helper function get New SlotId
    static async getNextSlotId(dbConnection) {
        const query = `
            SELECT * 
            FROM AvailableSlot
            WHERE SlotId=(SELECT max(SlotId) FROM AvailableSlot);
        `;
        const request = dbConnection.request();
        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].SlotId);
    }

    // Emmanuel
    static async createAvailableSlot(doctorId, slotDate, slotTimeId) {
        const connection = await sql.connect(dbConfig);
        const newSlotId = await AvailableSlot.getNextSlotId(connection);

        const query = `
            INSERT INTO AvailableSlot (SlotId, DoctorId, SlotDate, SlotTimeId)
            VALUES (@SlotId, @DoctorId, @SlotDate, @SlotTimeId)
        `;

        const request = connection.request();
        request.input('SlotId', newSlotId);
        request.input('DoctorId', doctorId);
        request.input('SlotDate', slotDate);
        request.input('SlotTimeId', slotTimeId);

        const result = await request.query(query);
        connection.close();

        return result.recordset;
    }

    // Emmanuel
    static async updateAvailableSlot(slotId, updatedFields) {
        const allowedFields = {
            'doctor': 'DoctorId',
            'date': 'SlotDate',
            'timeId': 'SlotTimeId',
        };

        if (updatedFields.length === 0) {
            throw new Error("No Fields to Update");
        }

        const connection = await sql.connect(dbConfig);
        const request = connection.request()

        // Populate Query with Updated Fields
        let query = `UPDATE AvailableSlot SET `;
        for (const field in updatedFields) {
            if (Object.keys(allowedFields).includes(field) && updatedFields[field] !== null) {
                query += `${allowedFields[field]} = @${field}, `;
                request.input(field, updatedFields[field]);
            }
        }
        query = query.slice(0, -2); // Remove last ', '
        query += ` WHERE SlotId = '${slotId}'`;
        request.input("SlotId", slotId);
        // console.log(await query);
        // console.log(updatedFields);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }

    // Emmanuel
    static async getAvailableSlotsBySlotTimeId(timeId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT aslot.*
            FROM AvailableSlot aslot
            LEFT JOIN SlotTime st ON aslot.SlotTimeId = st.SlotTimeId
            WHERE st.SlotTimeId = @SlotTimeId;
        `;

        const request = connection.request();
        request.input('SlotTimeId', timeId);

        const result = await request.query(query);
        connection.close();
        if (result.recordset.length == 0) return null;

        return result.recordset.map(
            availableSlot => new AvailableSlot(
                availableSlot.slotId,
                availableSlot.doctorId,
                availableSlot.slotDate,
                availableSlot.slotTimeId)
        );
    }

    // Emmanuel
    static async getAnotherAvailableSlot(doctorId, timeId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT TOP 1 aslot.*
            FROM AvailableSlot aslot
            LEFT JOIN SlotTime st ON aslot.SlotTimeId = st.SlotTimeId
            WHERE st.SlotTimeId = @SlotTimeId AND aslot.DoctorId != @DoctorId;
        `;

        const request = connection.request();
        request.input('SlotTimeId', timeId);
        request.input('DoctorId', doctorId);

        const result = await request.query(query);
        connection.close();
        if (result.recordset.length == 0) return null;

        return result.recordset.map(
            availableSlot => new AvailableSlot(
                availableSlot.slotId,
                availableSlot.doctorId,
                availableSlot.slotDate,
                availableSlot.slotTimeId)
        );
    }

    // Emmanuel
    static async getAvailableSlotsByDoctorId(doctorId) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT *
            FROM AvailableSlot
            WHERE DoctorId = @DoctorId;
        `;

        const request = connection.request();
        request.input('DoctorId', doctorId);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset.map(
            availableSlot => new AvailableSlot(
                availableSlot.slotId,
                availableSlot.doctorId,
                availableSlot.slotDate,
                availableSlot.slotTimeId)
        );
    }

    // Emmanuel
    static async getAllAvailableSlotsDateTimes(date) {
        const connection = await sql.connect(dbConfig);
        //console.log(date)

        // gets date and times that are not being used in existing appointments
        let query = `
        SELECT avs.SlotDate, st.SlotTime
        FROM availableSlot avs
        LEFT JOIN Appointments a ON avs.SlotId = a.SlotId
        LEFT JOIN SlotTime st ON avs.SlotTimeId = st.SlotTimeId
        WHERE a.SlotId IS NULL AND avs.SlotDate = @Date`;
        const request = connection.request();
        request.input('Date', date);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset;
    }

    // Emmanuel
    // configurable WHERE select for AvailableSlot
    static async getAvailableSlotByDateAndTime(conditionFields) {

        if (conditionFields.length === 0) {
            throw new Error("No Fields to get slots");
        }

        const connection = await sql.connect(dbConfig);
        const request = connection.request()

        // Populate Query with conditionFields
        let query = `
        SELECT TOP 1 aslot.* 
        FROM AvailableSlot aslot
        LEFT JOIN SlotTime st ON aslot.SlotTimeId = st.SlotTimeId
        WHERE aslot.SlotDate = @SlotDate AND st.SlotTime = @Time`;

        request.input('SlotDate', conditionFields.date);
        request.input('Time', conditionFields.time);

        // Send Request
        const result = await request.query(query);
        connection.close();

        return result.recordset;
    }
}

module.exports = AvailableSlot;