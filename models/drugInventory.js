const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DrugInventory {
    constructor(drugRecordId, drugName, drugExpiryDate, drugAvailableQuantity, drugTotalQuantity, drugRecordEntryDate, companyId) {
        this.drugRecordId = drugRecordId;
        this.drugName = drugName;
        this.drugExpiryDate = new Date(drugExpiryDate);
        this.drugAvailableQuantity = drugAvailableQuantity;
        this.drugTotalQuantity = drugTotalQuantity;
        this.drugRecordEntryDate = new Date(drugRecordEntryDate);
        this.companyId = companyId;
    }

    static async getDrugInventory() {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT 
            di.DrugRecordId, 
            di.DrugName, 
            di.DrugExpiryDate, 
            di.DrugAvailableQuantity, 
            di.DrugTotalQuantity, 
            di.DrugRecordEntryDate, 
            di.CompanyId, 
            dp.DrugPrice,
            dp.DrugDescription
        FROM 
            DrugInventoryRecord di
        INNER JOIN 
            DrugInventory dp ON di.DrugName = dp.DrugName`;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        const inventory = result.recordset.map(row => ({
            id: row.DrugRecordId,
            name: row.DrugName,
            expiryDate: new Date(row.DrugExpiryDate).toISOString().split("T")[0],
            availableQuantity: row.DrugAvailableQuantity,
            entryDate: new Date(row.DrugRecordEntryDate).toISOString().split("T")[0],
            companyId: row.CompanyId,
            price: row.DrugPrice,
            description: row.DrugDescription
        }));

        return inventory;
    }
}

module.exports = DrugInventory;
