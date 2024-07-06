const sql = require("mssql");
const dbConfig = require ("../dbConfig");

class DrugOrder{
    constructor(appointmentId, drugName, drugQuantity, totalCost, contributeDate, confirmationDate, contributionStatus) {
        this.appointmentId = appointmentId;
        this.drugName = drugName;
        this.drugQuantity = drugQuantity;
        this.totalCost = totalCost;
        this.contributeDate = contributeDate;
        this.confirmationDate = confirmationDate;
        this.contributionStatus = contributionStatus
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
                do.ContributionStatus
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

        return result.recordset.map(row =>
            new DrugOrder(
                row.AppointmentId,
                row.DrugName,
                row.Quantity,
                row.TotalCost,
                row.ContributeDate,
                row.ConfirmationDate,
                row.ContributionStatus
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

}

module.exports = DrugOrder;