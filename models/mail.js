const mailgun = require("mailgun-js")
require("dotenv").config();

class Mail {
    static async sendPaymentConfirmation(recepient, paymentAmount, cardMerchant, cardLFDigits, appointmentDate, appointmentTime) {
        const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: process.env.MAILGUN_DOMAIN });

        let emailBody = "";
        if (cardMerchant === "Digital Wallet") {
            emailBody = `
                Dear Customer, 
                \n\nWe have received your payment of $${paymentAmount} for your appointment on ${appointmentDate} at ${appointmentTime}. 
                \nPayment was made using your ${cardMerchant} on ${new Date().toDateString()}. 
                \nThank you for using CareLinc.
                \n\nRegards,
                \nCareLinc Team`
        } else {
            emailBody = `
                Dear Customer, 
                \n\nWe have received your payment of $${paymentAmount} for your appointment on ${appointmentDate} at ${appointmentTime}. 
                \nPayment was made using your ${cardMerchant} ending in ${cardLFDigits} on ${new Date().toDateString()}. 
                \nThank you for using CareLinc.
                \n\nRegards,
                \nCareLinc Team`
        }

        const mainData = {
            from: `CareLinc <payments@${process.env.MAILGUN_DOMAIN}>`,
            to: [recepient],
            subject: `Payment Confirmation`,
            text: emailBody
        }

        const sendResponse = await mg.messages().send(mainData);

        return sendResponse.message;
    }

    static async sendAppointmentConfirmation() {

    }
}

module.exports = Mail;