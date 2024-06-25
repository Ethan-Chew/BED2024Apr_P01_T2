const Account = require("./account");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Company extends Account {
    constructor(id, name, email, password, creationDate, createdBy, companyAddress) {
        super(id, name, email, password, creationDate);
        this.createdBy = createdBy;
        this.companyAddress = companyAddress;
    }

    static async createCompany(name, email, password, companyAddress, createdBy) {
        const connection = await sql.connect(dbConfig);
        const newAccountId = await Account.getNextAccountId(connection);
        const insertUnixTime = Math.floor(Date.now() / 1000);

        const insertAccountQuery = `
            INSERT INTO Account (AccountId, AccountName, AccountEmail, AccountPassword, AccountCreationDate) VALUES
            ('${newAccountId}', '${name}', '${email}', '${password}', ${insertUnixTime});
        `
        const insertCompanyQuery = `
            INSERT INTO Company (CompanyId, CompanyCreatedBy, CompanyAddress) VALUES
            ('${newAccountId}', '${createdBy}', '${companyAddress}');
        `;

        const request = connection.request();
        request.input('AccountId', newAccountId);
        request.input('AccountName', name);
        request.input('AccountEmail', email);
        request.input('AccountPassword', password);
        request.input('AccountCreationDate', insertUnixTime);

        request.input('CompanyId', newAccountId);
        request.input('CompanyCreatedBy', createdBy);
        request.input('CompanyAddress', companyAddress);

        await request.query(insertAccountQuery);
        await request.query(insertCompanyQuery);

        connection.close()

        return new Company(newAccountId, name, email, password, insertUnixTime, createdBy, companyAddress);
    }

    static async getCompanyById(companyId) {
        try {
            const connection = await sql.connect(dbConfig);
            
    
            const query = `
                SELECT 
                    a.AccountId,
                    a.AccountName,
                    a.AccountEmail,
                    a.AccountPassword,
                    a.AccountCreationDate,
                    c.CompanyCreatedBy,
                    c.CompanyAddress
                FROM Account a
                INNER JOIN Company c ON a.AccountId = c.CompanyId
                WHERE a.AccountId = @CompanyId;
            `;

            console.log('Company ID for query:', companyId); // Debug log
            const request = connection.request();
            request.input('CompanyId', sql.VarChar, companyId);

            const result = await request.query(query);
            console.log('SQL query result:', result); // Debug log
            connection.close();
    
            if (result.recordset && result.recordset.length > 0) {
                const record = result.recordset[0];
                return new Company(
                    record.AccountId,
                    record.AccountName,
                    record.AccountEmail,
                    record.AccountPassword,
                    record.AccountCreationDate,
                    record.CompanyCreatedBy,
                    record.CompanyAddress
                );
            } else {
                return null; // Return null if no company found
            }
        } catch (error) {
            console.error('Error retrieving company by id:', error);
            throw error; // Rethrow the error for handling in the controller
        }
    }

}

module.exports = Company;