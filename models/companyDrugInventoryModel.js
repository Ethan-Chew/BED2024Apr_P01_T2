const sql = require("mssql");
const dbConfig = require("../dbConfig");

class CompanyDrugInventory {
    constructor (drugName, drugExpiryDate, drugQuantity, drugPrice, drugDescription, companyId){
        this.drugName = drugName;
        this.drugExpiryDate = drugExpiryDate;
        this.drugQuantity = drugQuantity;
        this.drugPrice = drugPrice;
        this.drugDescription = drugDescription;
        this.companyId = companyId
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
}

module.exports = CompanyDrugInventory;