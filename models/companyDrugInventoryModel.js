const sql = require("mssql");
const dbConfig = require("../dbConfig");

class CompanyDrugInventory {
    constructor (drugName, drugExpiryDateClose, drugExpiryDateFar, drugQuantity, drugPrice, drugDescription, companyId){
        this.drugName = drugName;
        this.drugExpiryDateClose = drugExpiryDateClose;
        this.drugExpiryDateFar = drugExpiryDateFar;
        this.drugQuantity = drugQuantity;
        this.drugPrice = drugPrice;
        this.drugDescription = drugDescription;
        this.companyId = companyId;
    }

    static async getDrugName(){
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT
                DrugName
            FROM
                DrugInventory
        `

        const request = connection.request();
        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;
        
        return result.recordset.map(row => row.DrugName);
    }

    static async getInventoryByDrugName(drugName, companyId){
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT
                di.DrugName,
                (SELECT MIN(dr1.DrugExpiryDate)
                FROM DrugInventoryRecord dr1
                WHERE dr1.DrugName = di.DrugName AND dr1.CompanyId = dr.CompanyId) AS 'DrugExpiryDateClose',
                (SELECT MAX(dr2.DrugExpiryDate)
                FROM DrugInventoryRecord dr2
                WHERE dr2.DrugName = di.DrugName AND dr2.CompanyId = dr.CompanyId) AS 'DrugExpiryDateFar',
                SUM(dr.DrugAvailableQuantity) AS 'DrugQuantity',
                di.DrugPrice,
                di.DrugDescription,
                dr.CompanyId
            FROM
                DrugInventory di
            JOIN
                DrugInventoryRecord dr
            ON
                di.DrugName = dr.DrugName
            WHERE
                di.DrugName = @drugName AND dr.CompanyId = @companyId
            GROUP BY
                di.DrugName,
                di.DrugPrice,
                di.DrugDescription,
                dr.CompanyId
        `

        const query2 = `
            SELECT
                DrugName,
                DrugPrice,
                DrugDescription
            FROM
                DrugInventory
            WHERE
                DrugName = @drugName
        `

        const request = connection.request();
        request.input('drugName', sql.VarChar, drugName);
        request.input('companyId', sql.VarChar, companyId);
        const result = await request.query(query);
        const result2 = await request.query(query2);
        connection.close();

        if (result.recordset.length == 0) {
            return result2.recordset.map(row => new CompanyDrugInventory(
                row.DrugName,
                null,
                null,
                0,
                row.DrugPrice,
                row.DrugDescription,
                companyId
            ));
        };
        return result.recordset.map(row => new CompanyDrugInventory(row.DrugName, row.DrugExpiryDateClose, row.DrugExpiryDateFar, row.DrugQuantity, row.DrugPrice, row.DrugDescription, row.CompanyId));
    }

    static async emptyMedicineFromInventory(drugName, companyId) {
        const connection = await sql.connect(dbConfig);
    
        const transaction = new sql.Transaction(connection);
        try {
            await transaction.begin();
    
            // Select the current quantities
            const selectQuery = `
                SELECT DrugRecordId, DrugAvailableQuantity, DrugTotalQuantity
                FROM DrugInventoryRecord
                WHERE DrugName = @drugName AND CompanyId = @companyId
            `;
            const request = new sql.Request(transaction);
            request.input('drugName', sql.VarChar, drugName);
            request.input('companyId', sql.VarChar, companyId);
            const selectResult = await request.query(selectQuery);
    
            if (selectResult.recordset.length === 0) {
                throw new Error("Record not found");
            }
    
            for (const record of selectResult.recordset) {
                const { DrugRecordId, DrugAvailableQuantity, DrugTotalQuantity } = record;
    
                if (DrugAvailableQuantity === DrugTotalQuantity) {
                    // Delete the record
                    const deleteQuery = `
                        DELETE
                        FROM DrugInventoryRecord
                        WHERE DrugRecordId = @DrugRecordId
                    `;
                    const deleteRequest = new sql.Request(transaction);
                    deleteRequest.input('DrugRecordId', sql.VarChar, DrugRecordId);
                    await deleteRequest.query(deleteQuery);
                } else {
                    // Update the quantities
                    const updateQuery = `
                        UPDATE DrugInventoryRecord
                        SET 
                            DrugAvailableQuantity = 0, 
                            DrugTotalQuantity = DrugTotalQuantity - @DrugAvailableQuantity
                        WHERE DrugRecordId = @DrugRecordId
                    `;
                    const updateRequest = new sql.Request(transaction);
                    updateRequest.input('DrugAvailableQuantity', sql.Int, DrugAvailableQuantity);
                    updateRequest.input('DrugRecordId', sql.VarChar, DrugRecordId);
                    await updateRequest.query(updateQuery);
                }
            }
    
            await transaction.commit();
            connection.close();
    
            return 'Updaet Complete'; // Indicate success
        } catch (error) {
            await transaction.rollback();
            connection.close();
            throw error;
        }
    }
}

module.exports = CompanyDrugInventory;