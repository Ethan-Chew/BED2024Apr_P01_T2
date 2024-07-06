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

const deleteDrugOrder = async (req, res) =>{
    try {
        const { appointmentId, drugName } = req.params; // Use req.query if parameters come from the query string
        
        // Validate input
        if (!appointmentId || !drugName) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        await DrugOrder.deleteDrugOrder(appointmentId, drugName);

        // Respond with success message
        res.status(200).json({ message: 'Drug order deleted successfully' });
    } catch (err) {
        console.error('Error deleting drug order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getAllDrugOrders,
    deleteDrugOrder
}