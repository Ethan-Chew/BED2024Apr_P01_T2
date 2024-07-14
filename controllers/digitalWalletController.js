const DigitalWallet = require('../models/digitalWallet');

// Created By: Ethan Chew
const getDigitalWallet = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify the User's Identity
        if (req.user.id !== patientId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "User is not authorized to view the Digital Wallet for this user"
            });
        }

        // Get the Digital Wallet
        const wallet = await DigitalWallet.getDigitalWalletByPatient(patientId);

        if (wallet) {
            res.status(200).json({
                status: "Success",
                message: "Digital Wallet retrieved successfully",
                wallet: wallet,
            });
        } else {
            res.status(404).json({
                status: "Not Found",
                message: "User does not have a Digital Wallet with their account"
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
const createDigitalWallet = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { balance } = req.body;

        // Verify that the balance is a positive number and exists
        if (!balance || balance < 0) {
            return res.status(400).json({
                status: "Validation Error",
                message: "Digital Wallet balance must not be null or negative"
            });
        }

        // Verify the User's Identity
        if (req.user.id !== patientId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "User is not authorized to create a Digital Wallet for this user"
            });
        }

        // Check if Digital Wallet already exists
        const existingWallet = await DigitalWallet.getDigitalWalletByPatient(patientId);
        if (existingWallet) {
            return res.status(400).json({
                status: "Error",
                message: "A Digital Wallet already exists for this user"
            });
        }

        // If it does not exist, create a new Digital Wallet
        const newWallet = await DigitalWallet.createDigitalWallet(patientId, balance);

        res.status(201).json({
            status: "Success",
            message: "Digital Wallet created successfully",
            data: newWallet
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

// Created By: Ethan Chew
const updateDigitalWallet = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { updateAmount } = req.body;

        // Verify the User's Identity
        if (req.user.id !== patientId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "User is not authorized to update the balance of the Digital Wallet for this user"
            });
        }

        // Verify that the Digital Wallet Exists
        const existingWallet = await DigitalWallet.getDigitalWalletByPatient(patientId);
        if (!existingWallet) {
            return res.status(404).json({
                status: "Not Found",
                message: "User does not have a Digital Wallet with their account"
            });
        }

        // Update the Balance
        const updatedBalance = existingWallet.balance + updateAmount;
        const updatedWallet = await DigitalWallet.updateDigitalWallet(patientId, updatedBalance);

        res.status(200).json({
            status: "Success",
            message: "Digital Wallet updated successfully",
            wallet: updatedWallet
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

// Created By: Ethan Chew
const deleteDigitalWallet = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify the User's Identity
        if (req.user.id !== patientId) {
            return res.status(403).json({
                status: "Forbidden",
                message: "User is not authorized to delete the Digital Wallet for this user"
            });
        }

        // Check that the Wallet Exists
        const verifyWallet = await DigitalWallet.getDigitalWalletByPatient(patientId);
        if (!verifyWallet) {
            return res.status(404).json({
                status: "Not Found",
                message: "User does not have a Digital Wallet with their account"
            });
        }

        // Delete the Digital Wallet
        const deleteWallet = await DigitalWallet.deleteDigitalWallet(patientId);
        if (deleteWallet) {
            return res.status(200).json({
                status: "Success",
                message: "Digital Wallet deleted successfully"
            });
        } else {
            return res.status(500).json({
                status: "Error",
                message: "An error occurred while deleting the Digital Wallet"
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
    getDigitalWallet,
    createDigitalWallet,
    updateDigitalWallet,
    deleteDigitalWallet,
}