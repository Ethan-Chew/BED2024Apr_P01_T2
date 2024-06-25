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
        `

        const request = connection.request();
        const result = await request.query(query);
        console.log('SQL query result:', result); // Debug log
        connection.close();
        console.log(result);
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

}

module.exports = DrugRequest;