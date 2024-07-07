const sql = require("mssql");
const dbConfig = require ("../dbConfig");

class DrugOrder{
    constructor(appointmentId, drugName, drugQuantity, totalCost, contributeDate, confirmationDate, contributionStatus, drugRecordId) {
        this.appointmentId = appointmentId;
        this.drugName = drugName;
        this.drugQuantity = drugQuantity;
        this.totalCost = totalCost;
        this.contributeDate = contributeDate;
        this.confirmationDate = confirmationDate;
        this.contributionStatus = contributionStatus;
        this.drugRecordId = drugRecordId;
    }

    static async getAllDrugOrders(){
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT
                do.AppointmentId,
                do.DrugName,
                do.Quantity,
                do.TotalCost,
                do.ContributeDate,
                do.ConfirmationDate,
                do.ContributionStatus,
                do.DrugRecordId
            FROM
                DrugRequestContribution do
            WHERE
                do.ContributionStatus = 'Pending'
        `

        const request = connection.request();
        const result = await request.query(query);
        //console.log('SQL query result:', result); // Debug log
        connection.close();

        if (result.recordset.length == 0) return null;

        console.log(result.recordset);
        return result.recordset.map(row =>
            new DrugOrder(
                row.AppointmentId,
                row.DrugName,
                row.Quantity,
                row.TotalCost,
                row.ContributeDate,
                row.ConfirmationDate,
                row.ContributionStatus,
                row.DrugRecordId
            )
        );
    }

    static async deleteDrugOrder(appointmentId, drugName){
        try{
            const connection = await sql.connect(dbConfig);

            const query = `
                DELETE FROM DrugRequestContribution
                WHERE AppointmentId = @appointmentId AND DrugName = @drugName
            `
            const request = connection.request();
            request.input('appointmentId', sql.VarChar, appointmentId);
            request.input('drugName', sql.VarChar, drugName);
            await request.query(query);

            connection.close();
        } catch (error) {
            console.error('Error Deleting drug order: ', error);
            throw error;
        }
    }

    static async returnMedicine(drugQuantity, drugRecordId){
        try{
            const connection = await sql.connect(dbConfig);

            const query = `
                UPDATE DrugInventoryRecord
                SET DrugAvailableQuantity = DrugAvailableQuantity + @drugQuantity
                WHERE DrugRecordId = @drugRecordId
            `
            const request = connection.request();
            request.input('drugQuantity', sql.Int, drugQuantity);
            request.input('drugRecordId', sql.VarChar, drugRecordId);
            await request.query(query);

            connection.close();
        } catch (error) {
            console.error('Error Returning drug order: ', error);
            throw error;
        }
    }
}

module.exports = DrugOrder;