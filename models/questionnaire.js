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

    // Created by: Ethan Chew
    static async getQuestionnaireWithAccountId(accountId) {
        const connection = await sql.connect(dbConfig);

        const query = `SELECT * FROM Questionnaire WHERE AccountId = '${accountId}'`;
        const request = connection.request();

        const result = await request.query(query);
        connection.close();

        return result.recordset[0];
    }

    // Created by: Ethan Chew
    static async createQuestionnaire(accountId, qAnswers) {
        const connection = await sql.connect(dbConfig);

        const query = `
            INSERT INTO Questionnaire (AccountId, QOne, QTwo, QThree, QFour, QFive, QSix) VALUES
            (@AccountId, @QOne, @QTwo, @QThree, @QFour, @QFive, @QSix)
        `;
        const request = connection.request();
        request.input('AccountId', accountId);
        request.input('QOne', qAnswers.qOne);
        request.input('QTwo', qAnswers.qTwo);
        request.input('QThree', qAnswers.qThree);
        request.input('QFour', qAnswers.qFour);
        request.input('QFive', qAnswers.qFive);
        request.input('QSix', qAnswers.qSix);

        const result = await request.query(query);
        connection.close();

        return result;
    }

    // Created by: Ethan Chew
    static async deleteQuestionnaire(accountId) {
        const connection = await sql.connect(dbConfig);

        const query = `DELETE FROM Questionnaire WHERE AccountId = @AccountId`;
        const request = connection.request();
        request.input('AccountId', accountId);

        const result = await request.query(query);
        connection.close();

        return result.rowsAffected[0] === 1;
    }
}

module.exports = Questionnaire;