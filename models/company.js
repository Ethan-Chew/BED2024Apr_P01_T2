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
}

module.exports = Company;