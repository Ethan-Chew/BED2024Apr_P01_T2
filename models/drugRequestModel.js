// Model Created by: Jefferson
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DrugRequest {
    constructor(appointmentId, drugName, drugQuantity, drugPrice, requestDate, drugAvailabilityQuantity) {
        this.appointmentId = appointmentId;
        this.drugName = drugName;
        this.drugQuantity = drugQuantity;
        this.drugPrice = drugPrice;
        this.requestDate = requestDate;
        this.drugAvailabilityQuantity = drugAvailabilityQuantity;
    }

    static async getAllDrugRequestOrder(){
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT 
                pm.AppointmentId,
                pm.DrugName,
                pm.Quantity,
                di.DrugPrice,
                s.SlotDate
            FROM 
                PrescribedMedication pm
            JOIN 
                DrugInventory di ON pm.DrugName = di.DrugName
            JOIN 
                Appointments a ON pm.AppointmentId = a.AppointmentId
            JOIN 
                AvailableSlot s ON a.SlotId = s.SlotId
            WHERE 
                pm.DrugRequest = 'Pending'
        `;

        const request = connection.request();
        const result = await request.query(query);
        //console.log('SQL query result:', result); // Debug log
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset.map(row =>
            
            new DrugRequest(
                row.AppointmentId,
                row.DrugName,
                row.Quantity, // Ensure this matches the alias in SQL query
                row.DrugPrice,
                row.SlotDate // Ensure this matches the alias in SQL query
            )
        );
    }

    static async getDrugOrderByIdAndDrugName(appointmentId, drugName) {
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT
                pm.AppointmentId,
                pm.DrugName,
                pm.Quantity,
                di.DrugPrice,
                dir.DrugAvailableQuantity
            FROM 
                PrescribedMedication pm
            JOIN
                DrugInventory di ON pm.DrugName = di.DrugName
            JOIN
                DrugInventoryRecord dir ON pm.DrugName = dir.DrugName
            WHERE
                pm.AppointmentId = @appointmentId
                AND pm.DrugName = @drugName
        `;

        const request = connection.request();
        request.input('appointmentId', sql.VarChar, appointmentId);
        request.input('drugName', sql.VarChar, drugName);
        const result = await request.query(query);
        connection.close();

        if (result.recordset.length === 0) return null; // Handle case when no result is found

        // Access the properties correctly from result.recordset[0]
        const row = result.recordset[0];
        return new DrugRequest(
            row.AppointmentId,
            row.DrugName,
            row.Quantity,
            row.DrugPrice,
            null, // Assuming no request date in the query
            row.DrugAvailableQuantity
        );
    }

    static async contributeDrugRequest(appointmentId, drugName, contributedQuantity) {
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);
    
        try {
            await transaction.begin();
            
            let remainingQuantity = contributedQuantity;
            let lastUpdatedRecordId = null;

            while (remainingQuantity > 0) {
                const nearestRecord = await DrugRequest.findNearestRecordWithEnoughQuantity(drugName, remainingQuantity, transaction);
                
                if (!nearestRecord.recordId) {
                    throw new Error('Insufficient drug quantity in inventory.');
                }
    
                const { recordId, availableQuantity } = nearestRecord;
    
                const reduceQuantity = Math.min(remainingQuantity, availableQuantity);
    
                const updateInventoryQuery = `
                    UPDATE DrugInventoryRecord
                    SET DrugAvailableQuantity = DrugAvailableQuantity - @reduceQuantity
                    WHERE DrugRecordId = @recordId
                `;
    
                const request = new sql.Request(transaction);
                request.input('recordId', sql.VarChar, recordId);
                request.input('reduceQuantity', sql.Int, reduceQuantity);
    
                await request.query(updateInventoryQuery);
    
                remainingQuantity -= reduceQuantity;
                lastUpdatedRecordId = recordId;
            }
            const updateMedicationQuery = `
                UPDATE PrescribedMedication
                SET DrugRequest = 'Completed'
                WHERE AppointmentId = @appointmentId AND DrugName = @drugName
            `;

            // Update prescribed medication status
            const medicationRequest = new sql.Request(transaction);
            medicationRequest.input('appointmentId', sql.VarChar, appointmentId);
            medicationRequest.input('drugName', sql.VarChar, drugName);

            try {
                await medicationRequest.query(updateMedicationQuery);
                console.log('Medication request updated successfully.');
            } catch (queryError) {
                console.error('Error updating prescribed medication status:', queryError);
                throw new Error(`Failed to update prescribed medication status. Error: ${queryError.message}`);
            }
    
            await transaction.commit();
            console.log('Drug request contribution and inventory update completed successfully.');
            return { recordId: lastUpdatedRecordId }; // Return the last updated recordId
        } catch (error) {
            console.error('Error during transaction:', error);
            if (transaction) {
                try {
                    await transaction.rollback();
                } catch (rollbackError) {
                    console.error('Error during transaction rollback:', rollbackError);
                }
            }
            throw error; // Re-throw the error to handle it in the caller
        } finally {
            connection.close();
        }
    }

    static async addRequestContribution(appointmentId, drugName, quantity, totalCost, contributeDate, companyId, drugRecordId){
        const connection = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(connection);
        const confirmationDate = null;
        const contributionStatus = 'Pending';

        try {
            await transaction.begin();
            // Validate input parameters (e.g., check for positive quantity)
            if (quantity <= 0) {
                throw new Error('Quantity must be greater than zero.');
            }
            
            const query = `
                INSERT INTO DrugRequestContribution 
                (AppointmentId, DrugName, Quantity, TotalCost, ContributeDate, ConfirmationDate, ContributionStatus, CompanyId, DrugRecordId) VALUES
                (@appointmentId, @drugName, @quantity, @totalCost, @contributeDate, @confirmationDate, @contributionStatus, @companyId, @drugRecordId)
            `;

            const request = new sql.Request(transaction);
            request.input('appointmentId', sql.VarChar, appointmentId);
            request.input('drugName', sql.VarChar, drugName);
            request.input('quantity', sql.Int, quantity);
            request.input('totalCost', sql.Money, totalCost);
            request.input('contributeDate', sql.Date, contributeDate);
            request.input('confirmationDate', sql.Date, confirmationDate);
            request.input('contributionStatus', sql.VarChar, contributionStatus);
            request.input('companyId', sql.VarChar, companyId);
            request.input('drugRecordId', sql.VarChar, drugRecordId);

            await request.query(query);
            await transaction.commit();
            console.log('Drug request contribution added/updated successfully.');
        } catch (error) {
            console.error('Error adding/updating drug request contribution:', error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }
    
    // Helper function to find the nearest record with enough quantity
    static async findNearestRecordWithEnoughQuantity(drugName, requiredQuantity, transaction) {
        const connection = transaction._connection; // Access the connection from the transaction
        try {
            const query = `
                SELECT TOP 1 DrugRecordId, DrugAvailableQuantity
                FROM DrugInventoryRecord
                WHERE DrugName = @drugName
                    AND DrugAvailableQuantity >= @requiredQuantity
                ORDER BY ABS(DATEDIFF(day, GETDATE(), DrugExpiryDate)) ASC
            `;
    
            const request = new sql.Request(transaction);
            request.input('drugName', sql.VarChar, drugName);
            request.input('requiredQuantity', sql.Int, requiredQuantity);
    
            const result = await request.query(query);
    
            if (result.recordset.length > 0) {
                const { DrugRecordId, DrugAvailableQuantity } = result.recordset[0];
                return { recordId: DrugRecordId, availableQuantity: DrugAvailableQuantity };
            }
    
            return { recordId: null, availableQuantity: 0 };
        } finally {
            // Close the connection in the finally block
            if (connection) {
                connection.close();
            }
        }
    }

    static async cancelDrugOrder(appointmentId, drugName){
        const connection = await sql.connect(dbConfig);
        const query = `
            UPDATE PrescribedMedication
            SET DrugRequest = 'Pending'
            WHERE AppointmentId = @appointmentId AND DrugName = @drugName
        `;

        const request = new sql.Request(connection);
        request.input('appointmentId', sql.VarChar, appointmentId);
        request.input('drugName', sql.VarChar, drugName);

        try {
            await request.query(query);
            console.log('Drug request status updated to "Cancelled" successfully.');
        } catch (queryError) {
            console.error('Error updating drug request status:', queryError);
            throw new Error(`Failed to update drug request status. Error: ${queryError.message}`);
        } finally {
            connection.close();
        }
    }

}

module.exports = DrugRequest;