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
        const questionnaire = await questionnaire.createQuestionnaire(account.AccountId, qns);

        res.status(201).json({
            message: "Account Created Successfully",
            account: account
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    authLoginAccount,
    authCreatePatient
}