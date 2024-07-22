// Controller Created by: Jefferson
const DrugOrder = require('../models/drugOrderModel');

const getAllDrugOrders = async (req, res) =>{
    try {
        const companyId = req.params.companyId;
        const drugOrders = await DrugOrder.getAllDrugOrders(companyId);
        
        if (!drugOrders) {
            return res.status(404).json({ error: 'No drug orders found for the company' });
        }
        
        if (req.user.id !== companyId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view the Drug Order."
            });
            return;
        }
        
        res.json(drugOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
};

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
};

const returnMedicine = async (req, res) =>{
    try {
        const { drugQuantity, drugRecordId } = req.params;
        
        // Validate input
        if (!drugQuantity || !drugRecordId) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        await DrugOrder.returnMedicine(drugQuantity, drugRecordId);

        // Respond with success message
        res.status(200).json({ message: 'Medicine returned successfully' });
    } catch (err) {
        console.error('Error returning medicine:', err);
        res.status(500).json({ error: 'Internal server error' });
    }

};

const confirmDrugOrder = async (req, res) =>{
    try {
        const { appointmentId, drugName } = req.params;

        // Validate input
        if (!appointmentId || !drugName) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        await DrugOrder.confirmDrugOrder(appointmentId, drugName);

        // Respond with success message
        res.status(200).json({ message: 'Drug order confirmed successfully' });
    } catch (err) {
        console.error('Error confirming drug order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllDrugOrders,
    deleteDrugOrder,
    returnMedicine,
    confirmDrugOrder
};