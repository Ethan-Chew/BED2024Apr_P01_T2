const qrcode = require('qrcode');
const otplib  = require('otplib');
const sql = require("mssql");
const dbConfig = require("../dbConfig");

class AccountSecret {
  constructor(accountId, secret, userEmail) {
    this.accountId = accountId;
    this.secret = secret;
    this.userEmail = userEmail;
  }

  static async getAuth(accountId) {
    const connection = await sql.connect(dbConfig);
    const query = `
    SELECT * FROM AccountSecret WHERE AccountId = @AccountId;
    `;

    const request = connection.request();
    request.input('AccountId', accountId);

    const result = await request.query(query);
    connection.close();

    return result.recordset[0];
  }

  static async add2FA(accountId, userEmail) {

    const service = 'CareLinc';
    const secret = otplib.authenticator.generateSecret();
    const otpauth = otplib.authenticator.keyuri(userEmail, service, secret);

    const connection = await sql.connect(dbConfig);
    const query = `
    INSERT INTO AccountSecret (AccountId, SecretKey) VALUES
    (@AccountId, @SecretKey);
    `;

    const request = connection.request();
    request.input('AccountId', accountId);
    request.input('SecretKey', secret);

    const result = await request.query(query);
    connection.close();

    return new Promise((resolve, reject) => {
      qrcode.toDataURL(otpauth, (err, url) => {
        if (err) {
          console.error('Error with QR', err);
          reject(err);
        } else {
          resolve(url);
        }
      });
    });

  }
  
}

module.exports = { 
  AccountSecret 
};