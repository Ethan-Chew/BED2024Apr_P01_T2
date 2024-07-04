const Account = require("../models/account");
const Patient = require("../models/patient");
const Company = require("../models/company");
const Questionnaire = require("../models/questionnaire");
const PaymentMethod = require("../models/paymentMethod");
const Doctor = require("../models/doctor");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Created by: Ethan Chew
const authLoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required."
            });
        }
        
        const account = await Account.getAccountWithEmail(email);

        if (!account) {
            return res.status(404).json({
                message: `Account with email ${email} not found.`
            });
        }

        // Check the Account's Password and see if it matches
        const checkPasswordMatch = await bcrypt.compare(password, account.AccountPassword);
        if (checkPasswordMatch) {
            return res.status(403).json({
                message: "Incorrect Password"
            });
        }

        // Determine the Account's Role
        let role = "";
        if (account.PatientId) {
            // Ensure that the Patient's Account has been Approved by an Admin
            if (account.PatientIsApproved === "Approved") {
                role = "patient";
            } else {
                return res.status(403).json({
                    message: "Unauthorised",
                    approvalStatus: account.isApproved
                })
            }
        } else if (account.CompanyId) {
            role = "company";
        } else if (account.DoctorId) {
            role = "doctor";
        } else if (account.StaffId) {
            role = "admin";
        }

        // Generate a JWT Token
        const tokenMaxAge = 10800
        const token = await jwt.sign(
            { id: account.AccountId, email: account.AccountEmail, role: role },
            process.env.JWT_SECRET,
            { expiresIn: tokenMaxAge }
        );
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: tokenMaxAge * 1000
        });

        res.status(200).json({
            message: "Login Successful",
            accountId: account.AccountId,
            role: role
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// Created by: Ethan Chew
const authCreatePatient = async (req, res) => {
    try {
        const { name, email, password, knownAllergies, birthdate, qns } = req.body;

        const userAccount = await Account.createAccount(name, email, password);
        const patientAccount = await Patient.createPatient(userAccount.id, name, email, password, userAccount.creationDate, knownAllergies, birthdate);
        await Questionnaire.createQuestionnaire(patientAccount.id, qns);

        res.status(201).json({
            message: "Account Created Successfully",
            account: patientAccount
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Created by: Ethan Chew
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
            return res.status(400).send({ message: 'Patient ID is required' });
        }
        
        await PaymentMethod.deleteAllPaymentMethod(patientId); // Delete all attached payment methods if exists
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

// Created by: Ethan Chew
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

//HERVIN
const getAllDoctor = async (req, res) => {
    try {
        const doctors = await Doctor.getAllDoctors();

        if (!doctors) {
            res.status(404).json({
                message: `Doctors not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Doctors Found",
            doctors: doctors
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

//HERVIN
const getDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(400).send({ message: 'Doctor ID is required' });
        }

        const doctor = await Doctor.getDoctorById(doctorId);

        if (!doctor) {
            res.status(404).json({
                message: `Doctor with ID ${doctorId} not found.`
            });
            return;
        }

        res.status(200).json({
            message: "Doctor with ID Found",
            doctor: doctor
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}
//HERVIn
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

const deleteDoctorById = async (req, res) => {
    try {
        const { doctorId } = req.params;

        if (!doctorId) {
            return res.status(400).send({ message: 'Doctor ID is required' });
        }
        
        const deleteDoctorRequest = await Doctor.deleteDoctorById(doctorId);
        const deleteAccountRequest = await Account.deleteAccountById(doctorId);

        if ( deleteDoctorRequest && deleteAccountRequest) {
            res.status(200).json({
                message: "Doctor Account Deleted Successfully"
            });
        } else {
            res.status(500).json({
                message: "Failed to Delete Doctor Account"
            });
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

//HERVIN 
const updateDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(400).send({ message: 'Doctor ID is required' });
        }

        const { name, email, creationDate } = req.body;
    
        // Update Doctor
        const updateDoctorRes = await Doctor.updateDoctorById(doctorId, name, email, creationDate);

        if (updateDoctorRes) {
            res.status(200).json({
                message: "Doctor Account Updated Successfully",
                updateDoctorRes
                //doctor: await Doctor.getDoctorById(doctorId)
            });
        } else {
            res.status(500).json({
                message: "Failed to Update Doctor Account"
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
    authCreateCompany,
    getAllPatient,
    getAllUnapproved,
    getQuestionnaireWithAccountId,
    adminUpdatePatientById,
    getAllDoctor,
    getDoctorById,
    updateDoctorById,
    deleteDoctorById,
}