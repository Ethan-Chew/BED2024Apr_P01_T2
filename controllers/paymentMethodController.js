const PaymentMethod = require('../models/paymentMethod');

// Created by: Ethan Chew
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

// Created by: Ethan Chew
const createPaymentMethod = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { merchant, cardName, cardNumber, cardExpiryDate } = req.body;

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

// Created by: Ethan Chew
const updatePaymentMethod = async (req, res) => {
    try {
        const { merchant, cardName, cardNumber, cardExpiryDate } = req.body;
        const methodId = req.params.methodId;
        const patientId = req.params.patientId;

        if (!patientId || !merchant || !cardName || !cardNumber || !methodId || !cardExpiryDate) {
            res.status(400).json({
                message: "Method Id, Patient ID, Merchant, Card Name, Card Number, and Card Expiry Date are required."
            });
            return;
        }
        
        const editRequest = await PaymentMethod.updatePaymentMethod(methodId, patientId, merchant, cardName, cardNumber, cardExpiryDate);

        res.status(200).json({
            message: "Payment Method Updated",
            paymentMethod: editRequest
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

// Created by: Ethan Chew
const deletePaymentMethod = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const methodId = req.params.methodId;

        if (!patientId || !methodId) {
            res.status(400).json({
                message: "Patient ID and Payment Method Id are required."
            });
            return;
        }

        const deleteRequest = await PaymentMethod.deletePaymentMethod(methodId);

        if (!deleteRequest) {
            res.status(500).json({
                message: "Internal Server Error"
            });
            return;
        }
        
        res.status(204).json({
            message: "Payment Method Deleted"
        });
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
    updatePaymentMethod,
}