const Account = require("../models/account");
const Patient = require("../models/patient");
const Company = require("../models/company");
const Questionnaire = require("../models/questionnaire");

const authLoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            res.status(400).json({
                message: "Email and Password are required."
            });
        }
        
        const account = await Account.getAccountWithEmail(email);

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
    try {
        const { name, email, password, knownAllergies, birthdate, qns } = req.body;

        const account = await Patient.createPatient(name, email, password, knownAllergies, birthdate);
        const userQuestionnaire = await questionnaire.createQuestionnaire(account.id, qns);

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
    try {
        const patientId = req.params.patientId;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const patient = await Patient.getPatientById(patientId);

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

const getQuestionnaireWithAccountId = async (req, res) => {
    try {
        const patientId = req.params.accountId;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const patient = await questionnaire.getQuestionnaireWithAccountId(patientId);

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
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }
        
        const deleteQuestionnaireRequest = await Questionnaire.deleteQuestionnaire(patientId);
        const deletePatientRequest = await Patient.deletePatientById(patientId);
        const deleteAccountRequest = await Account.deleteAccountById(patientId);

        if (deleteQuestionnaireRequest && deletePatientRequest && deleteAccountRequest) {
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

const updatePatientById = async (req, res) => {
    try {
        const { patientId } = req.params;

        if (!patientId) {
            return res.status(400).send({ message: 'Patient ID is required' });
        }

        const { name, email, knownAllergies, birthdate, password } = req.body;
    
        // Update Patient
        const updatePatientRes = await Patient.updatePatient(patientId, {
            knownAllergies: knownAllergies,
            birthdate: birthdate,
        });

        // Update Account (Patient's Parent Class)
        const updateAccountRes = await Account.updateAccount(patientId, {
            name: name,
            email: email,
            password: password
        })

        if (updatePatientRes && updateAccountRes) {
            res.status(200).json({
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

const authCreateCompany = async (req, res) => {
    try {
        const { name, email, password, companyAddress, createdBy } = req.body;

        const company = await Company.createCompany(name, email, password, companyAddress, createdBy);

        res.status(201).json({
            message: "Company Created Successfully",
            company: company
        });
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
    authCreateCompany,
    getAllPatient,
    getAllUnapproved,
    getQuestionnaireWithAccountId,
}