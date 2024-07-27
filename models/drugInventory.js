const sql = require("mssql");
const dbConfig = require("../dbConfig");

class DrugInventory {
    constructor (drugName, drugExpiryDateClose, drugExpiryDateFar, drugQuantity, drugPrice, drugDescription, companyId){
        this.drugName = drugName;
        this.drugExpiryDateClose = drugExpiryDateClose;
        this.drugExpiryDateFar = drugExpiryDateFar;
        this.drugQuantity = drugQuantity;
        this.drugPrice = drugPrice;
        this.drugDescription = drugDescription;
        this.companyId = companyId;
    }

    static async getDrugInventory() {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT
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
                    dr.companyId
                FROM
                    DrugInventory di
                JOIN
                    DrugInventoryRecord dr
                ON
                    di.DrugName = dr.DrugName
                GROUP BY
                    di.DrugName,
                    di.DrugPrice,
                    di.DrugDescription,
                    dr.CompanyId
            `;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        const inventory = result.recordset.map(row => ({
            id: row.DrugRecordId,
            name: row.DrugName,
            expiryDateClose: new Date(row.DrugExpiryDateClose).toISOString().split("T")[0],
            expiryDateFar: new Date(row.DrugExpiryDateFar).toISOString().split("T")[0],
            availableQuantity: row.DrugQuantity,
            companyId: row.companyId,
            price: row.DrugPrice,
            description: row.DrugDescription
        }));
        
        return inventory;
    }
}

module.exports = DrugInventory;
