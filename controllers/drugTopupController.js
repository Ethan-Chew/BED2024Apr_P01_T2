const drugTopup = require('../models/drugTopup');

const requestTopup = async (req, res) => {
    try {
        const { drugName, topupQuantity } = req.body;

        // Validate input data
        if (!drugName || topupQuantity == null) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure quantity is a positive integer
        if (topupQuantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than zero' });
        }

        await drugTopup.requestTopup(drugName, topupQuantity);

        res.status(201).json({ message: `${drugName} topup request added successfully` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); 
    }
}

module.exports = {
    requestTopup
}