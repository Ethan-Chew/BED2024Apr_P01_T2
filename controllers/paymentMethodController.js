const PaymentMethod = require('../models/paymentMethod');

const getPaymentMethodsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        if (!patientId) {
            res.status(400).json({
                message: "Patient ID is required."
            });
            return;
        }

        const paymentMethods = await PaymentMethod.getPaymentMethodsByPatientId(patientId);

        if (paymentMethods) {
            res.status(200).json({
                message: "Found Payment Methods",
                paymentMethods: paymentMethods
            });
        } else {
            res.status(404).json({
                message: "Payment Methods not found."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const createPaymentMethod = async (req, res) => {
    try {
        const { patientId, merchant, cardName, cardNumber, cardExpiryDate } = req.body;

        if (!patientId || !merchant || !cardName || !cardNumber || !cardExpiryDate) {
            res.status(400).json({
                message: "Patient ID, Merchant, Card Name, Card Number, and Card Expiry Date are required."
            });
            return;
        }

        const createRequest = await PaymentMethod.createPaymentMethod(patientId, merchant, cardName, cardNumber, cardExpiryDate);

        if (createRequest) {
            res.status(201).json({
                message: "Payment Method Created",
                paymentMethod: createRequest 
            });
        } else {
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const deletePaymentMethod = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const cardNumber = req.body.cardNumber;

        if (!patientId || !cardNumber) {
            res.status(400).json({
                message: "Patient ID and Card Number are required."
            });
            return;
        }

        const deleteRequest = await PaymentMethod.deletePaymentMethod(patientId, cardNumber);

        if (!deleteRequest) {
            res.status(500).json({
                message: "Internal Server Error"
            });
            return;
        }
        
        res.status(204);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    getPaymentMethodsByPatientId,
    createPaymentMethod,
    deletePaymentMethod,
}