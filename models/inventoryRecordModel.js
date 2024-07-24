// Model Created by: Jefferson
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class InventoryRecord {
    constructor (drugRecordId, dateOfEntry, drugName, availableDrug, totalDrug, expiryDate) {
        this.drugRecordId = drugRecordId;
        this.dateOfEntry = dateOfEntry;
        this.drugName = drugName;
        this.availableDrug = availableDrug;
        this.totalDrug = totalDrug;
        this.expiryDate = expiryDate;
    }

    static async getInventoryRecordByCompanyId(companyId) {
        const connection = await sql.connect(dbConfig);

        try {
            const query = `
                SELECT
                    DrugRecordId,
                    DrugRecordEntryDate,
                    DrugName,
                    DrugAvailableQuantity,
                    DrugTotalQuantity,
                    DrugExpiryDate
                FROM
                    DrugInventoryRecord
                WHERE
                    CompanyId = @companyId
            `;
            
            const request = connection.request();
            request.input('companyId', sql.VarChar, companyId);
            const result = await request.query(query);
            if (result.recordset.length === 0) return null;
        
            return result.recordset.map(row => new InventoryRecord(
              row.DrugRecordId,
              row.DrugRecordEntryDate,
              row.DrugName,
              row.DrugAvailableQuantity,
              row.DrugTotalQuantity,
              row.DrugExpiryDate
            ));
          } catch (error) {
            console.error("Error fetching inventory record:", error);
            throw error;
          } finally {
            connection.close();
          }
    }

    static async deleteDrugRecordByRecordId(drugRecordId) {
        const connection = await sql.connect(dbConfig);
        try {
            
            const query = `
                DELETE FROM 
                    DrugInventoryRecord 
                WHERE 
                    DrugRecordId = @drugRecordId
            `;
            const request = connection.request();
            request.input('drugRecordId', sql.VarChar, drugRecordId);
            
            await request.query(query);
            connection.close();
            
            return 'Record Deleted';
        } catch (error) {
            console.error(`Error deleting drug record: ${error}`);
            throw error;
        }
    }

    static async updateDrugQuantityByRecordId(drugRecordId) {
        const connection = await sql.connect(dbConfig);
        
        try {
            const query = `
                UPDATE 
                    DrugInventoryRecord 
                SET 
                    DrugTotalQuantity = DrugTotalQuantity - DrugAvailableQuantity,
                    DrugAvailableQuantity = 0
                WHERE 
                    DrugRecordId = @drugRecordId
            `;
            
            const request = connection.request();
            request.input('drugRecordId', sql.VarChar, drugRecordId);
            
            await request.query(query);
            connection.close();
            
            return 'Quantity Updated';
        } catch (error) {
            console.error(`Error updating drug quantity: ${error}`);
            throw error;
        }
    }
}

module.exports = InventoryRecord;