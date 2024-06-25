const Account = require("./account");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Doctor extends Account {
    constructor(id, name, email, password, creationDate, createdBy) {
        super(id, name, email, password, creationDate);
        this.createdBy = createdBy;
    }
}

module.exports = Doctor;