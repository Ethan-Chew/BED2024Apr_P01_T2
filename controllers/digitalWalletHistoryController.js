const DigitalWalletHistory = require("../models/digitalWalletHistory");

// Created By: Ethan Chew
const getDigitalWalletHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify User's Identity
        if (req.user.id !== patientId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "User is not authorized to view the Digital Wallet History for this user"
            });
        }

        // Retrieve Digital Wallet History
        const walletHistory = await DigitalWalletHistory.getDigitalWalletHistoryByPatient(patientId);

        if (walletHistory) {
            res.status(200).json({
                status: "Success",
                message: "Digital Wallet History retrieved successfully",
                walletHistory: walletHistory
            });
        } else {
            res.status(404).json({
                status: "Not Found",
                message: "User does not have any Digital Wallet History"
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

const addDigitalWalletHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { amount } = req.body;

        // Verify User's Identity
        if (req.user.id !== patientId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "User is not authorized to add Digital Wallet History for this user"
            });
        }

        // Verify the body's amount exists and is a number
        if (!amount || isNaN(amount)) {
            return res.status(400).json({
                status: "Validation Error",
                message: "Amount must be a number and must not be null"
            });
        }

        // Add the History
        const newHistory = await DigitalWalletHistory.createHistory(patientId, amount);

        if (newHistory) {
            res.status(201).json({
                status: "Success",
                message: "Digital Wallet History added successfully",
                walletHistory: newHistory
            });
        } else {
            throw new Error("Failed to add Digital Wallet History");
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

const deleteDigitalWalletHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify User's Identity
        if (req.user.id !== patientId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "User is not authorized to delete the Digital Wallet History for this user"
            });
        }

        // Delete the History
        const deleteHistory = await DigitalWalletHistory.deleteAllHistory(patientId);

        if (deleteHistory) {
            res.status(200).json({
                status: "Success",
                message: "Digital Wallet History deleted successfully"
            });
        } else {
            res.status(404).json({
                status: "Not Found",
                message: "User's Digital Wallet History not found"
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

module.exports = {
    getDigitalWalletHistory,
    addDigitalWalletHistory,
    deleteDigitalWalletHistory,
};