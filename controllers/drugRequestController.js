const DrugRequest = require('../models/drugRequestModel');

const getAllDrugRequestOrder = async (req, res) => {
    try {
        const drugRequests = await DrugRequest.getAllDrugRequestOrder();
        res.json(drugRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
    
}

module.exports = {
    getAllDrugRequestOrder
}