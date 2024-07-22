// Controller Created by: Jefferson
const DrugRequest = require('../models/drugRequestModel');

const getAllDrugRequestOrder = async (req, res) => {
    try {
        const drugRequests = await DrugRequest.getAllDrugRequestOrder();
        res.status(200).json(drugRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
};

const getDrugOrderByIdAndDrugName = async (req, res) => {
    try {
        const { appointmentId, drugName, companyId } = req.params;
        const drugOrder = await DrugRequest.getDrugOrderByIdAndDrugName(appointmentId, drugName, companyId);
        if (!drugOrder) {
            return res.status(404).json({ error: 'Drug order not found' });
        }
        res.status(200).json(drugOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
};

const addRequestContribution = async (req, res) => {
    try {
        let { appointmentId, drugName, quantity, totalCost, contributeDate, companyId, drugRecordId } = req.body;

        // Validate input data
        if (!appointmentId || !drugName || quantity == null || !totalCost || !contributeDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure quantity is a positive integer
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than zero' });
        }

        // Call the addRequestContribution method from the DrugRequest class
        await DrugRequest.addRequestContribution(
            appointmentId,
            drugName,
            quantity,
            totalCost,
            contributeDate,
            companyId,
            drugRecordId
        );

        console.log('Drug request contribution added successfully');
        res.status(201).json({ message: 'Drug request contribution added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
};

const contributeDrugRequest = async (req, res) => {
    try {
        const { appointmentId, drugName } = req.params;
        const contributedQuantity = req.body.contributedQuantity;
        const drugOrder = await DrugRequest.getDrugOrderByIdAndDrugName(appointmentId, drugName);
        if (!drugOrder) {
            return res.status(404).json({ error: 'Drug order not found' });
        }
        // Contribute to the drug request (Update the status to 'Completed' and update Drug Inventory Record Quantity)
        const recordId = await DrugRequest.contributeDrugRequest(appointmentId, drugName, contributedQuantity);
        // Send success response
        res.status(200).json({ recordId, success: true, message: 'Drug request contribution completed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
};

const cancelDrugOrder = async (req, res) => {
    try {
        const { appointmentId, drugName } = req.params;
        const drugOrder = await DrugRequest.getDrugOrderByIdAndDrugName(appointmentId, drugName);
        if (!drugOrder) {
            return res.status(404).json({ error: 'Drug order not found' });
        }
        // Cancel the drug request (Update the status to 'Cancelled')
        await DrugRequest.cancelDrugOrder(appointmentId, drugName);
        // Send success response
        res.status(200).json({ success: true, message: 'Drug request cancelled successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
};



module.exports = {
    getAllDrugRequestOrder,
    getDrugOrderByIdAndDrugName,
    addRequestContribution,
    contributeDrugRequest,
    cancelDrugOrder
};