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

const addRequestContribution = async (req, res) => {
    try {
        const { appointmentId, drugName, quantity, totalCost, contributeDate, confirmationDate, contributionStatus, companyId } = req.body;

        console.log('Received body:', req.body); // Log request body

        // Validate input data
        if (!appointmentId || !drugName || quantity == null || !totalCost || !contributeDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure quantity is a positive integer
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than zero' });
        }

        // Default contributionStatus to 'Pending' if not provided
        const status = contributionStatus || 'Pending';

        // Call the addRequestContribution method from the DrugRequest class
        await DrugRequest.addRequestContribution(
            appointmentId,
            drugName,
            quantity,
            totalCost,
            contributeDate,
            confirmationDate,
            status,
            companyId
        );

        console.log('Drug request contribution added successfully');
        res.status(201).json({ message: 'Drug request contribution added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
}

const contributeDrugRequest = async (req, res) => {
    try {
        const { id, drugName } = req.params;
        const contributedQuantity = req.body.contributedQuantity;
        console.log('Received parameters:', { id, drugName }); // Log parameters
        const drugOrder = await DrugRequest.getDrugOrderByIdAndDrugName(id, drugName);
        console.log('Drug Order: ', drugOrder)
        if (!drugOrder) {
            return res.status(404).json({ error: 'Drug order not found' });
        }
        // Contribute to the drug request (Update the status to 'Completed' and update Drug Inventory Record Quantity)
        await DrugRequest.contributeDrugRequest(id, drugName, contributedQuantity);
        // Send success response
        res.json({ success: true, message: 'Drug request contribution completed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' }); // Return JSON
    }
}


module.exports = {
    getAllDrugRequestOrder,
    getDrugOrderByIdAndDrugName,
    addRequestContribution,
    contributeDrugRequest
}