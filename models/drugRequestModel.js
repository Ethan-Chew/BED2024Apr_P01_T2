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
        `

        const request = connection.request();
        const result = await request.query(query);
        console.log('SQL query result:', result); // Debug log
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
        `

        const request = connection.request();
        request.input('appointmentId', sql.VarChar, appointmentId);
        request.input('drugName', sql.VarChar, drugName);
        const result = await request.query(query);
        console.log('SQL query result:', result); // Debug log
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

}

module.exports = DrugRequest;