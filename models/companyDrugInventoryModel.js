// Model Created by: Jefferson
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
                WHERE dr1.DrugName = di.DrugName AND dr1.CompanyId = dr.CompanyId AND dr1.DrugAvailableQuantity > 0) AS 'DrugExpiryDateClose',
                (SELECT MAX(dr2.DrugExpiryDate)
                FROM DrugInventoryRecord dr2
                WHERE dr2.DrugName = di.DrugName AND dr2.CompanyId = dr.CompanyId AND dr2.DrugAvailableQuantity > 0) AS 'DrugExpiryDateFar',
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

    static async createDrugInventoryRecord(drugName, drugExpiryDate, drugQuantity, companyId) {
        const connection = await sql.connect(dbConfig);
    
        const transaction = new sql.Transaction(connection);
        try {
            await transaction.begin();

            // Get the latest DrugRecordId from the table
            const getLastRecordQuery = `
                SELECT TOP 1 DrugRecordId
                FROM DrugInventoryRecord
                ORDER BY DrugRecordId DESC;
            `;
            const recordRequest = new sql.Request(transaction);
            const recordResult = await recordRequest.query(getLastRecordQuery);

            let lastDrugRecordId = recordResult.recordset[0].DrugRecordId;
            let drugRecordId = incrementDrugRecordId(lastDrugRecordId);
    
            const insertQuery = `
                INSERT INTO DrugInventoryRecord (DrugRecordId, DrugName, DrugExpiryDate, DrugAvailableQuantity, DrugTotalQuantity, DrugRecordEntryDate, CompanyId)
                VALUES (@drugRecordId, @drugName, @drugExpiryDate, @drugQuantity, @drugQuantity,  CAST(GETDATE() AS DATE), @companyId)
            `;
            const request = new sql.Request(transaction);
            request.input('drugRecordId', sql.VarChar, drugRecordId);
            request.input('drugName', sql.VarChar, drugName);
            request.input('drugExpiryDate', sql.Date, drugExpiryDate);
            request.input('drugQuantity', sql.Int, drugQuantity);
            request.input('companyId', sql.VarChar, companyId);
            await request.query(insertQuery);
    
            await transaction.commit();
            connection.close();
    
            return 'Insert Complete'; // Indicate success
        } catch (error) {
            await transaction.rollback();
            connection.close();
            throw error;
        }
    }

    static async removeDrugFromInventoryRecord(drugName, drugQuantity, companyId) {
        const connection = await sql.connect(dbConfig);
        
        const transaction = new sql.Transaction(connection);
        try {
            await transaction.begin();

            // Get records with available quantity greater than 0, ordered by expiry date
            const getRecordQuery = `
                SELECT DrugRecordId, DrugAvailableQuantity, DrugTotalQuantity, DrugExpiryDate
                FROM DrugInventoryRecord
                WHERE DrugAvailableQuantity > 0 AND CompanyId = @companyId AND DrugName = @drugName
                ORDER BY DrugExpiryDate ASC;
            `;
            const recordRequest = new sql.Request(transaction);
            recordRequest.input('drugName', sql.VarChar, drugName);
            recordRequest.input('companyId', sql.VarChar, companyId);
            const recordResult = await recordRequest.query(getRecordQuery);

            let remainingQuantityToRemove = drugQuantity;

            for (let record of recordResult.recordset) {
                if (remainingQuantityToRemove <= 0){
                    break;
                }

                const availableQuantity = record.DrugAvailableQuantity;
                const totalQuantity = record.DrugTotalQuantity;
                const quantityToRemove = Math.min(availableQuantity, remainingQuantityToRemove);

                if (quantityToRemove === totalQuantity) {
                    const deleteQuery = `
                        DELETE FROM DrugInventoryRecord
                        WHERE DrugRecordId = @drugRecordId;
                    `;

                    const deleteRequest = new sql.Request(transaction);
                    deleteRequest.input('drugRecordId', sql.VarChar, record.DrugRecordId);
                    await deleteRequest.query(deleteQuery);
                } else {
                    const updateQuery = `
                        UPDATE DrugInventoryRecord
                        SET
                            DrugAvailableQuantity = DrugAvailableQuantity - @quantityToRemove,
                            DrugTotalQuantity = DrugTotalQuantity - @quantityToRemove
                        WHERE
                            DrugRecordId = @drugRecordId;
                    `

                    const updateRequest = new sql.Request(transaction);
                    updateRequest.input('quantityToRemove', sql.Int, quantityToRemove);
                    updateRequest.input('drugRecordId', sql.VarChar, record.DrugRecordId);
                    await updateRequest.query(updateQuery);
                }
                
                
                remainingQuantityToRemove -= quantityToRemove;
            }

            await transaction.commit();
            connection.close();

            return 'Update Complete'
        } catch (error) {
            await transaction.rollback();
            connection.close();
            throw error;
        }
    }

    
}

// Helper function to increment DrugRecordId
function incrementDrugRecordId(lastDrugRecordId) {
    const prefix = lastDrugRecordId.substring(0, 3); // Assuming DRI is constant prefix
    const number = parseInt(lastDrugRecordId.substring(3)); // Extract number part
    const newNumber = number + 1;
    const newDrugRecordId = `${prefix}${newNumber.toString().padStart(4, '0')}`; // Assuming 4-digit number
    return newDrugRecordId;
}

module.exports = CompanyDrugInventory;