const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DrugRequest {
    constructor(appointmentId, drugName, drugQuantity, drugPrice, requestDate) {
        this.appointmentId = appointmentId;
        this.drugName = drugName;
        this.drugQuantity = drugQuantity;
        this.drugPrice = drugPrice;
        this.requestDate = requestDate;
    }

    static async getAllDrugRequestOrder(){
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT pm.AppointmentId, pm.DrugName, pm.Quantity, di.DrugPrice
            FROM PrescribedMedication pm
            JOIN DrugInventory di ON pm.DrugName = di.DrugName
            WHERE pm.DrugRequest = 'Pending'
        `

        const request = connection.request();
        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset.map(
            (row) => new DrugRequest(row.appointmentId, row.drugName, row.drugQuantity, row.drugPrice, row.requestDate)
        );
    }

}

module.exports = DrugRequest;