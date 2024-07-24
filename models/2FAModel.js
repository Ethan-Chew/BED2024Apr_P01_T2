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

  static async verify2FA(accountId, token) {
    const connection = await sql.connect(dbConfig);
    const query = `
    SELECT SecretKey FROM AccountSecret WHERE AccountId = @AccountId;
    `;

    const request = connection.request();
    request.input('AccountId', accountId);

    const result = await request.query(query);
    connection.close();

    if (result.recordset.length === 0) {
      return false;
    }

    const secret = result.recordset[0].SecretKey;
    const genToken = otplib.authenticator.generate(secret);
    return otplib.authenticator.verify({ token, secret });
  }

  static async getAuth(accountId) {
    const connection = await sql.connect(dbConfig);
    const query = `
    SELECT SecretKey FROM AccountSecret WHERE AccountId = @AccountId;
    `;

    const request = connection.request();
    request.input('AccountId', accountId);

    const result = await request.query(query);
    connection.close();


    return result.recordset[0];
  }

  static async GenerateQRCode(userEmail, accountId) {

    const service = 'CareLinc';
    const secret = otplib.authenticator.generateSecret();
    const otpauth = otplib.authenticator.keyuri(userEmail, service, secret);

    const connection = await sql.connect(dbConfig);
    const query = `
    INSERT INTO AccountSecret (AccountId, SecretKey) VALUES (@AccountId, @SecretKey);
    `;

    const request = connection.request();
    request.input('AccountId', accountId);
    request.input('SecretKey', secret);

    await request.query(query);
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