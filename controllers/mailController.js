const Mail = require("../models/mail");
require("dotenv").config();

// Created by: Ethan Cchew
const sendPaymentConfirmation = async (req, res) => {
    try {
        const recepient = req.body.recepient;
        const paymentAmount = req.body.paymentAmount;
        const cardMerchant = req.body.cardMerchant;
        const cardLFDigits = req.body.cardLFDigits;
        const appointmentDate = req.body.appointmentDate;
        const appointmentTime = req.body.appointmentTime;

        const sendRequest = await Mail.sendPaymentConfirmation(recepient, paymentAmount, cardMerchant, cardLFDigits, appointmentDate, appointmentTime);
        
        if (sendRequest) {
            res.status(201).json({
                status: "Success",
                message: "Payment Confirmation Email Sent"
            });
        } else {
            throw new Error("Failed to Send Email")
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

module.exports = {
    sendPaymentConfirmation
}