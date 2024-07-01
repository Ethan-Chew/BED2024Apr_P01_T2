const Mail = require("../models/mail");

// Created by: Ethan Cchew
const sendPaymentConfirmation = async (req, res) => {
    try {
        const recepient = req.body.recepient;
        const paymentAmount = req.body.paymentAmount;
        const cardMerchant = req.body.cardMerchant;
        const appointmentDate = req.body.appointmentDate;
        const appointmentTime = req.body.appointmentTime;

        const sendRequest = await Mail.sendPaymentConfirmation(recepient, paymentAmount, cardMerchant, appointmentDate, appointmentTime);
        
        if (sendRequest) {
            res.status(201).json({
                message: "Payment Confirmation Email Sent"
            });
        }

        res.status(201).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    sendPaymentConfirmation
}