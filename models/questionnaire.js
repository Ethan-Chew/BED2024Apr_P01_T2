const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Questionnaire {
    constructor(id, accountId, qOne, qTwo, qThree, qFour, qFive, qSix) {
        this.id = id;
        this.accountId = accountId;
        this.qOne = qOne;
        this.qTwo = qTwo;
        this.qThree = qThree;
        this.qFour = qFour;
        this.qFive = qFive;
        this.qSix = qSix;
    }

    static async getQuestionnaireWithAccountId(accountId) {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT * FROM Questionnaire WHERE AccountId = ${accountId}`;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        return result.recordset[0];
    }

    static async createQuestionnaire(accountId, qAnswers) {
        const connection = await sql.connect(dbConfig);

        const query = `
            INSERT INTO Questionnaire (AccountId, QOne, QTwo, QThree, QFour, QFive, QSix) VALUES 
            ('${accountId}', '${qAnswers.qOne}', '${qAnswers.qTwo}', '${qAnswers.qThree}', '${qAnswers.qFour}', '${qAnswers.qFive}', '${qAnswers.qSix}')
        `;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        return result;
    }
}

module.exports = Questionnaire;