const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DrugTopup {
    constructor(topupId, drugName, topupQuantity, topupRequestDate, topupStatus) {
      this.topupId = topupId;
      this.drugName = drugName;
      this.topupQuantity = topupQuantity;
      this.topupRequestDate = topupRequestDate;
      this.topupStatus = topupStatus;
    }

    static async getNextTopupId(connection) {
        const query = `SELECT * FROM DrugTopupRequest WHERE TopupId=(SELECT max(TopupId) FROM DrugTopupRequest);`
        const request = connection.request();

        const result = await request.query(query);

        const incrementString = str => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(result.recordset[0].TopupId);
    }
    //HERVIN
    static async requestTopup(drugName, topupQuantity) {
        
        const connection = await sql.connect(dbConfig);
        const newTopupId = await DrugTopup.getNextTopupId(connection)
    
        const query = `
            INSERT INTO DrugTopupRequest (TopupId, DrugName, TopupQuantity, TopupRequestDate, TopupStatus)
            VALUES (@topupId, @drugName, @topupQuantity, GETDATE(), 'Pending')
        `;
    
        const request = connection.request();

        request.input('topupId', newTopupId);
        request.input('drugName', drugName);
        request.input('topupQuantity', topupQuantity);
        await request.query(query);
    
        connection.close();
    
        return { newTopupId, drugName, topupQuantity };
    }


}

module.exports = DrugTopup;