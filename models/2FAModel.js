const qrcode = require('qrcode');
const otplib  = require('otplib');

function generateQRCodeUrl(userEmail) {
  const service = 'CareLinc';
  const secret = otplib.authenticator.generateSecret();
  const otpauth = otplib.authenticator.keyuri(userEmail, service, secret);

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

module.exports = { generateQRCodeUrl };