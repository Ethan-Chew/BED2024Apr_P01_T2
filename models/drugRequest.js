const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DrugRequest {
    constructor(orderID, drugName, drugQuantity, drugPrice, requestDate) {
        this.orderID = orderID;
        this.drugName = drugName;
        this.drugQuantity = drugQuantity;
        this.drugPrice = drugPrice;
        this.requestDate = requestDate;
    }

    static async getAllDrugRequestOrder(orderID){
        const connection = await sql.connect(dbConfig);

        const query = `
            SELECT pm.AppointmentId, pm.DrugName, pm.Quantity, di.DrugPrice
            FROM PrescribedMedication pm
            JOIN DrugInventory di ON pm.DrugName = di.DrugName
            WHERE pm.AppointmentId = @orderID AND pm.DrugRequest = 'Pending'
        `

        const request = connection.request();
        request.input('orderID', orderID);

        const result = await request.query(query);
        connection.close();

        if (result.recordset.length == 0) return null;

        return result.recordset.map(
            drugRequest => new DrugRequest(drugRequest.AppointmentId, drugRequest.DrugName, drugRequest.Quantity, drugRequest.DrugPrice)
        );
    }

}

module.exports = DrugRequest;