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

const getDrugOrderByIdAndDrugName = async (req, res) => {
    try {
        const { id, drugName } = req.params;
        console.log('Received parameters:', { id, drugName }); // Log parameters
        const drugOrder = await DrugRequest.getDrugOrderByIdAndDrugName(id, drugName);
        console.log('Drug Order: ', drugOrder)
        res.json(drugOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
}


module.exports = {
    getAllDrugRequestOrder,
    getDrugOrderByIdAndDrugName
}