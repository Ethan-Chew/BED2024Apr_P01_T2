const accounts = require("../models/account");

const authLoginAccount = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send("Email and Password are required");
    }
    
    try {
        const account = await accounts.Account.getAccountWithEmail(email);

        if (!account) {
            res.status(404).send(`Account with email ${email} not found.`);
            return;
        }

        if (account.AccountPassword !== password) {
            res.status(403).send("Incorrect Password");
        } else {
            res.status(200).send(account);
        }
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

const authCreatePatient = async (req, res) => {
    const { name, email, password, knownAllergies, birthdate, qns } = req.body;

    try {
        const account = await accounts.Patient.createPatient(name, email, password, knownAllergies, birthdate);

        res.status(201).send(account);
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    authLoginAccount,
}