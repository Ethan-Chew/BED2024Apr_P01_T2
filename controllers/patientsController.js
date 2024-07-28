const Account = require("../models/account");
const Patient = require("../models/patient");
const Questionnaire = require("../models/questionnaire");
const PaymentMethod = require("../models/paymentMethod");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Appointment = require("../models/appointment");
const DigitalWallet = require("../models/digitalWallet");
const DigitalWalletHistory = require("../models/digitalWalletHistory");
require("dotenv").config();

// Created by: Ethan Chew
const authLoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({
                status: 'Error',
                message: "Email and Password are required in the request body.",
            });
        }
        
        const account = await Account.getAccountWithEmail(email);

        if (!account) {
            return res.status(404).json({
                status: 'Not Found',
                message: `Account with email ${email} not found.`
            });
        }

        // Check the Account's Password and see if it matches
        const checkPasswordMatch = await bcrypt.compare(password, account.AccountPassword);
        if (!checkPasswordMatch) {
            return res.status(403).json({
                status: 'Error',
                message: "Incorrect Password",
            });
        }

        // Determine the Account's Role
        if (account.Role === "Patient" && account.PatientIsApproved !== "Approved") {
            return res.status(403).json({
                status: "Forbidden",
                message: "Unauthorised",
                approvalStatus: account.PatientIsApproved
            })
        }

        // Generate a JWT Token
        const tokenMaxAge = 10800
        const token = await jwt.sign(
            { id: account.AccountId, email: account.AccountEmail, role: account.Role },
            process.env.JWT_SECRET,
            { expiresIn: tokenMaxAge }
        );
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: tokenMaxAge * 1000
        });

        res.status(200).json({
            status: "Success",
            message: "Login Successful",
            accountId: account.AccountId,
            role: account.Role
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
};

// Created by: Ethan Chew
const authCreatePatient = async (req, res) => {
    try {
        const { name, email, password, knownAllergies, birthdate, qns } = req.body;

        if (!password || !qns) {
            return res.status(400).json({
                status: 'Error',
                message: "Password and Questionnaire are required in the request body."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userAccount = await Account.createAccount(name, email, hashedPassword);
        const patientAccount = await Patient.createPatient(userAccount.id, name, email, password, userAccount.creationDate, knownAllergies, birthdate);
        await Questionnaire.createQuestionnaire(patientAccount.id, qns);

        res.status(201).json({
            status: "Success",
            message: "Account Created Successfully",
            account: patientAccount
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

const approvePatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const approvePatientRes = await Patient.approvePatient(patientId);

        if (approvePatientRes) {
            res.status(200).json({
                message: "Patient Approved Successfully",
            });
        } else {
            res.status(500).json({
                message: "Failed to Approve Patient"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const denyPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const denyPatientRes = await Patient.denyPatient(patientId);

        if (denyPatientRes) {
            res.status(200).json({
                message: "Patient Denied Successfully",
            });
        } else {
            res.status(500).json({
                message: "Failed to Deny Patient"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }

}

// Created by: Ethan Chew
const getPatientById = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        // Ensure that AccountId in JWT matches PatientId
        if (req.user.id !== patientId) {
            return res.status(403).send({ 
                status: 'Forbidden',
                message: 'User is not authorised to view this account\'s details'
            });
        }

        const patient = await Patient.getPatientById(patientId);

        if (!patient) {
            res.status(404).json({
                status: 'Not Found',
                message: `Patient with ID ${patientId} not found.`
            });
            return;
        }

        res.status(200).json({
            status: "Success",
            message: "Patient with ID Found",
            patient: patient
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

const getPatientByIdAdmin = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        const patient = await Patient.getPatientById(patientId);

        if (!patient) {
            res.status(404).json({
                status: 'Not Found',
                message: `Patient with ID ${patientId} not found.`
            });
            return;
        }

        res.status(200).json({
            status: "Success",
            message: "Patient with ID Found",
            patient: patient
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

//HERVIN
const getAllPatient = async (req, res) => {
    try {

        const patients = await Patient.getAllPatient();

        if (!patients) {
            res.status(404).json({
                message: `Patients not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Patients Found",
            patients: patients
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
//HERVIN
const getAllUnapproved = async (req, res) => {
    try {

        const patients = await Patient.getAllUnapproved();

        if (!patients) {
            res.status(404).json({
                message: `Patients not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Patients Found",
            patients: patients
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
//HERVIN
const getQuestionnaireWithAccountId = async (req, res) => {
    try {
        const patientId = req.params.accountId;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const patient = await Questionnaire.getQuestionnaireWithAccountId(patientId);

        if (!patient) {
            res.status(404).json({
                message: `Patient with ID ${patientId} not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Patient with ID Found",
            patient: patient
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Created by: Ethan Chew
const deletePatientById = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ 
                status: 'Error',
                message: 'Patient ID is required'
            });
        }

        // Ensure that AccountId in JWT matches PatientId
        if (req.user.id !== patientId) {
            return res.status(403).send({ 
                status: 'Forbidden',
                message: "User is not authorised to delete this account"
            });
        }
        
        // Before deleting a Patient Account, ensure that every related data (Appointment, MaymentMethods, Questionnaire, DigitalWallet) is deleted
        await PaymentMethod.deleteAllPaymentMethod(patientId);
        
        // Get all Appointment of the Patient, then delete all of them
        const appointments = await Appointment.getAllPatientAppointment(patientId);
        if (appointments) {
            for (let i = 0; i < appointments.length; i++) {
                await Appointment.deleteAppointment(appointments[i].id);
            }
        }
        
        await DigitalWallet.deleteDigitalWallet(patientId);
        await DigitalWalletHistory.deleteAllHistory(patientId);

        const deleteQuestionnaireRequest = await Questionnaire.deleteQuestionnaire(patientId);
        const deletePatientRequest = await Patient.deletePatientById(patientId);
        const deleteAccountRequest = await Account.deleteAccountById(patientId);

        if (deleteQuestionnaireRequest && deletePatientRequest && deleteAccountRequest) {
            res.status(200).json({
                status: "Success",
                message: "Patient Account Deleted Successfully"
            });
        } else {
            res.status(500).json({
                status: "Error",
                message: "Failed to Delete Patient Account"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

const deletePatientByIdAdmin = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ 
                status: 'Error',
                message: 'Patient ID is required'
            });
        }

        // Before deleting a Patient Account, ensure that every related data (Appointment, MaymentMethods, Questionnaire, DigitalWallet) is deleted
        await PaymentMethod.deleteAllPaymentMethod(patientId);
        
        // Get all Appointment of the Patient, then delete all of them
        const appointments = await Appointment.getAllPatientAppointment(patientId);
        if (appointments) {
            for (let i = 0; i < appointments.length; i++) {
                await Appointment.deleteAppointment(appointments[i].id);
            }
        }
        
        await DigitalWallet.deleteDigitalWallet(patientId);
        await DigitalWalletHistory.deleteAllHistory(patientId);

        const deleteQuestionnaireRequest = await Questionnaire.deleteQuestionnaire(patientId);
        const deletePatientRequest = await Patient.deletePatientById(patientId);
        const deleteAccountRequest = await Account.deleteAccountById(patientId);

        if (deleteQuestionnaireRequest && deletePatientRequest && deleteAccountRequest) {
            res.status(200).json({
                status: "Success",
                message: "Patient Account Deleted Successfully"
            });
        } else {
            res.status(500).json({
                status: "Error",
                message: "Failed to Delete Patient Account"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

// Created by: Ethan Chew
const updatePatientById = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ 
                status: 'Error',
                message: 'Patient ID is required'
            });
        }

        // Ensure that AccountId in JWT matches PatientId
        if (req.user.id !== patientId) {
            return res.status(403).send({ 
                status: 'Forbidden',
                message: 'User is not authorised to update this account\'s details'
            });
        }

        const { name, email, knownAllergies, birthdate, password } = req.body;
    
        // Update Patient
        const updatePatientRes = await Patient.updatePatient(patientId, knownAllergies, birthdate);

        // Update Account (Patient's Parent Class)
        const salt = await bcrypt.genSalt(10);
        let hashedPassword = null;
        
        if (password) {
          hashedPassword = await bcrypt.hash(password, salt);
        }
        
        const updateAccountRes = await Account.updateAccount(patientId, name, email, hashedPassword);

        if (updatePatientRes && updateAccountRes) {
            res.status(200).json({
                status: "Success",
                message: "Patient Account Updated Successfully",
                patient: await Patient.getPatientById(patientId)
            });
        } else {
            res.status(500).json({
                status: "Error",
                message: "Failed to Update Patient Account"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

//HERVIN
const adminUpdatePatientById = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const { name, knownAllergies, birthdate, creationDate, isApproved } = req.body;
    
        // Update Patient
        const updatePatientRes = await Patient.adminUpdatePatient(patientId, {
            knownAllergies: knownAllergies,
            birthdate: birthdate,
            isApproved: isApproved
        });

        // Update Account (Patient's Parent Class)
        const updateAccountRes = await Account.adminUpdateAccount(patientId, {
            name: name,
            creationDate: Math.floor(new Date(creationDate).getTime() / 1000),
        })

        if (updatePatientRes && updateAccountRes) {
            res.status(201).json({
                message: "Patient Account Updated Successfully",
                patient: await Patient.getPatientById(patientId)
            });
        } else {
            res.status(500).json({
                message: "Failed to Update Patient Account"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    authLoginAccount,
    authCreatePatient,
    getPatientById,
    updatePatientById,
    deletePatientById,
    getAllPatient,
    getAllUnapproved,
    getQuestionnaireWithAccountId,
    adminUpdatePatientById,
    getPatientByIdAdmin,
    deletePatientByIdAdmin,
    approvePatient,
    denyPatient,
}