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
            WHERE SlotId=(SELECT max(slotId) FROM AvailableSlot);
        `;
        const request = dbConnection.request();
        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].slotId);
    }

    // Emmanuel
    static async createAvailableSlot(doctorId, slotDate, slotTimeId) {
        const connection = await sql.connect(dbConfig);
        const newSlotId = await AvailableSlot.getNextSlotId(dbConnection);

        const query = `
            INSERT INTO AvailableSlot (SlotId, DoctorId, SlotDate, SlotTimeId)
            VALUES (@SlotId, @DoctorId, @SlotDate, @SlotTimeId)
        `;

        const request = connection.request();
        request.input('SlotId', newSlotId);
        request.input('DoctorId', doctorId);
        request.input('SlotDate', slotDate);
        request.input('SlotTimeId', slotTimeId);

        await request.query(query);
        connection.close();

        return new AvailableSlot(newSlotId, doctorId, slotDate, slotTimeId);
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
        console.log(await query);
        console.log(updatedFields);

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
    // configurable WHERE select for AvailableSlot
    static async getAvailableSlotsByConditions(conditionFields) {
        const allowedFields = {
            'slotId': 'SlotId',
            'doctor': 'DoctorId',
            'date': 'SlotDate',
            'timeId': 'SlotTimeId',
        };

        if (conditionFields.length === 0) {
            throw new Error("No Fields to get slots");
        }

        const connection = await sql.connect(dbConfig);
        const request = connection.request()

        // Populate Query with conditionFields
        let query = `SELECT * FROM AvailableSlot WHERE `;
        for (const field in conditionFields) {
            if (Object.keys(allowedFields).includes(field) && conditionFields[field] !== null) {
                query += `${allowedFields[field]} = @${field}, `;
                request.input(field, conditionFields[field]);
            }
        }
        query = query.slice(0, -2); // Remove last ', '

        // Send Request
        const result = await request.query(query);
        connection.close();

        return result.recordset.length > 0;
    }
}

module.exports = AvailableSlot;