const DrugOrder = require('../models/drugOrderModel');

const getAllDrugOrders = async (req, res) =>{
    try {
        const drugOrders = await DrugOrder.getAllDrugOrders();
        res.json(drugOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
}

module.exports = {
    getAllDrugOrders
}