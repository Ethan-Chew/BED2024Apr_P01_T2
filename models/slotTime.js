const sql = require("mssql");
const dbConfig = require("../dbConfig");

class SlotTime {
    constructor(slotTimeId, slotTime) {
        this.slotTimeId = slotTimeId;
        this.slotTime = slotTime;
    }
    // SlotTime should not have delete or create functions as times are fixed

    // Emmanuel
    static async getSlotTimeIdByTime(time) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT SlotTimeId
            FROM SlotTime
            WHERE SlotTime = @SlotTime;
        `

        const request = connection.request();
        request.input('SlotTime', time);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length > 0) {
            return result.recordset[0].SlotTimeId;
        } else {
            return null;
        }

    }

}