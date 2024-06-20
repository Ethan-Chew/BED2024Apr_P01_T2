const accounts = require("../models/account");
const questionnaire = require("../models/questionnaire");

const authLoginAccount = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            message: "Email and Password are required."
        });
    }
    
    try {
        const account = await accounts.Account.getAccountWithEmail(email);

        if (!account) {
            res.status(404).json({
                message: `Account with email ${email} not found.`
            });
            return;
        }

        if (account.AccountPassword !== password) {
            res.status(403).json({
                message: "Incorrect Password"
            });
        } else {
            res.status(200).json({
                message: "Login Successful",
                account: account
            })
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const authCreatePatient = async (req, res) => {
    const { name, email, password, knownAllergies, birthdate, qns } = req.body;

    try {
        const account = await accounts.Patient.createPatient(name, email, password, knownAllergies, birthdate);
        // const questionnaire = await questionnaire.createQuestionnaire(account.AccountId, qns);

        res.status(201).json({
            message: "Account Created Successfully",
            account: account
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const getPatientById = async (req, res) => {
    const { patientId } = req.params;

    try {
        const patient = await accounts.Patient.getPatientById(patientId);

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

const deletePatientById = async (req, res) => {
    const { patientId } = req.params;

    try {
        const deleteRequest = await accounts.Patient.deletePatientById(patientId);

        if (deleteRequest) {
            res.status(200).json({
                message: "Patient Account Deleted Successfully"
            });
        } else {
            res.status(500).json({
                message: "Failed to Delete Patient Account"
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
    deletePatientById
}