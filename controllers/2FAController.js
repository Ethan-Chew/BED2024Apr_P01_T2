const twoFAModel = require('../models/2FAModel');

const generateQRCode = async (req, res) => {
    const userEmail = req.headers.email;
    const accountId = req.headers.accountid;

    try {
      const qrCodeUrl = await twoFAModel.AccountSecret.add2FA(accountId, userEmail); 
      res.send(qrCodeUrl); 
    } catch (error) {
      console.error('Failed to generate QR code', error);
      res.status(500).send('Failed to generate QR code');
    }
  }

const getAuth = async (req, res) => {
    const accountId = req.headers.accountid;
    
    try {
      const response = await twoFAModel.AccountSecret.getAuth(accountId); 
      res.send(response); 
    } catch (error) {
      console.error('Failed to get Auth', error);
      res.status(500).send('Failed to get Auth');
    }
  
}

module.exports = { 
  generateQRCode,
  getAuth
 };