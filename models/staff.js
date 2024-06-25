const Account = require("./account");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Staff extends Account {
    constructor(id, name, email, password, creationDate) {
        super(id, name, email, password, creationDate);
    }
}

module.exports = Staff;