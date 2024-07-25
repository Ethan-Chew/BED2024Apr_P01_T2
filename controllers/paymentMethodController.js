const PaymentMethod = require('../models/paymentMethod');

// Created by: Ethan Chew
const getPaymentMethodsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        if (!patientId) {
            res.status(400).json({
                status: "Error",
                message: "Patient ID is required."
            });
            return;
        }

        if (req.user.id !== patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view the Payment Methods for this Patient."
            });
            return;
        }

        const paymentMethods = await PaymentMethod.getPaymentMethodsByPatientId(patientId);

        if (paymentMethods) {
            res.status(200).json({
                status: "Success",
                message: "Found Payment Methods",
                paymentMethods: paymentMethods
            });
        } else {
            res.status(404).json({
                status: "Error",
                message: "Payment Methods not found."
            });
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

// Created By: Ethan Chew
const getPaymentMethodById = async (req, res) => {
    try {
        const { methodId } = req.params;

        const paymentMethod = await PaymentMethod.getPaymentMethodById(methodId);

        if (!paymentMethod) {
            res.status(404).json({
                status: "Error",
                message: "Payment Method not found."
            });
            return;
        }

        if (paymentMethod.patientId !== req.user.id) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view this Payment Method."
            });
            return;
        }

        res.status(200).json({
            status: "Success",
            paymentMethod: paymentMethod
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Created by: Ethan Chew
const createPaymentMethod = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (req.user.id !== patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to create a Payment Method for this Patient."
            });
            return;
        }

        const { merchant, cardName, cardNumber, cardExpiryDate } = req.body;

        if (!patientId || !merchant || !cardName || !cardNumber || !cardExpiryDate) {
            res.status(400).json({
                status: "Error",
                message: "Patient ID, Merchant, Card Name, Card Number, and Card Expiry Date are required."
            });
            return;
        }

        const createRequest = await PaymentMethod.createPaymentMethod(patientId, merchant, cardName, cardNumber, cardExpiryDate);

        if (createRequest) {
            res.status(201).json({
                status: "Success",
                message: "Payment Method Created",
                paymentMethod: createRequest 
            });
        } else {
            res.status(500).json({
                status: "Error",
                message: "Internal Server Error"
            });
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

// Created by: Ethan Chew
const updatePaymentMethod = async (req, res) => {
    try {
        const methodId = req.params.methodId;

        const paymentMethod = await PaymentMethod.getPaymentMethodById(methodId);
        if (paymentMethod.patientId !== req.user.id) { 
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to update a Payment Method for this Patient."
            });
            return;
        }

        const { merchant, cardName, cardNumber, cardExpiryDate } = req.body;

        const editRequest = await PaymentMethod.updatePaymentMethod(methodId, merchant, cardName, cardNumber, cardExpiryDate);

        res.status(200).json({
            status: "Success",
            message: "Payment Method Updated",
            paymentMethod: editRequest
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Created by: Ethan Chew
const deletePaymentMethod = async (req, res) => {
    try {
        const methodId = req.params.methodId;

        const paymentMethod = await PaymentMethod.getPaymentMethodById(methodId);

        if (req.user.id !== paymentMethod.patientId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to delete a Payment Method for this Patient."
            });
            return;
        }

        const deleteRequest = await PaymentMethod.deletePaymentMethod(methodId);

        if (!deleteRequest) {
            res.status(500).json({
                status: "Error",
                message: "Internal Server Error"
            });
            return;
        }
        
        res.status(204).json({
            status: "Success",
            message: "Payment Method Deleted"
        });
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
    getPaymentMethodsByPatientId,
    getPaymentMethodById,
    createPaymentMethod,
    deletePaymentMethod,
    updatePaymentMethod,
}