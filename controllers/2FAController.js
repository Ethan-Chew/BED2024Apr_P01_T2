const twoFAModel = require('../models/2FAModel');

const generateQRCode = async (req, res) => {
    const userEmail = req.headers.email;
    const accountId = req.headers.accountid;
    try {
      const qrCodeUrl = await twoFAModel.AccountSecret.GenerateQRCode(userEmail, accountId); 
      res.send(qrCodeUrl); 
    } catch (error) {
      console.error('Failed to generate QR code', error);
      res.status(500).send('Failed to generate QR code');
    }
  }

  
const getAuth = async (req, res) => {
    const accountId = req.params.accountId;
    
    try {
      const response = await twoFAModel.AccountSecret.getAuth(accountId); 
      if (!response) {
        res.status(404).send('Auth not found');
      } else {
        res.status(200).send("auth found"); 
      }
    } catch (error) {
      console.error('Failed to get Auth', error);
      res.status(500).send('Failed to get Auth');
    }
}

const verify2FA = async (req, res) => {
    const accountId = req.params.accountId;
    const token = req.headers.token;
    
    try {
      const response = await twoFAModel.AccountSecret.verify2FA(accountId, token);
      if (response === false) {
        res.status(404).send(false);
      } else {
        res.status(200).send(true); 
      }
    } catch (error) {
      console.error('Failed to verify 2FA', error);
      res.status(500).send('Failed to verify 2FA');
    }
}

module.exports = { 
  generateQRCode,
  getAuth,
  verify2FA
 };