// Controller Created by: Jefferson
const CompanyDrugInventory = require('../models/companyDrugInventoryModel');

const getDrugName = async (req, res) => {
    try {
        const drugName = await CompanyDrugInventory.getDrugName();
        res.json(drugName);
    } catch (error) {
        console.error('Error fetching medicine name:', error);
        res.status(404).json({ error: 'Drug not found' });
    }
};

const getInventoryByDrugName = async (req, res) => {
    try {
        const { companyId, drugName } = req.params;
        const drugInfo = await CompanyDrugInventory.getInventoryByDrugName(drugName, companyId);
        
        if (req.user.id !== companyId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view this drug inventory."
            });
            return;
        }

        res.json(drugInfo);
    } catch (error) {
        console.error('Error fetching medicine information:', error);
        res.status(404).json({ error: 'Inventory not found' });
    }
};

const emptyMedicineFromInventory = async (req, res) => {
    try {
        const { companyId, drugName } = req.params;
        const message = await CompanyDrugInventory.emptyMedicineFromInventory(drugName, companyId);
        res.json({ message });
    } catch (error) {
        console.error('Error emptying medicine from inventory:', error);
        res.status(404).json({ error: 'Drug not found' });
    }
};

const createDrugInventoryRecord = async (req, res) => {
    try {
        const { drugName, drugExpiryDate, drugQuantity, companyId } = req.body;
        const result = await CompanyDrugInventory.createDrugInventoryRecord(drugName, drugExpiryDate, drugQuantity, companyId);
        if (result.drugQuantity < 0) {
            res.status(400).json({ error: 'Invalid drug quantity' });
        }
        res.status(201).json({ message: 'Drug inventory record created successfully', data: result });
    } catch (error) {
        console.error('Error creating drug inventory record:', error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: 'Invalid request' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }    
    }
};

const removeDrugFromInventoryRecord = async (req, res) => {
    try {
        const { drugName, drugQuantity, companyId } = req.params;
        if (!companyId || !drugName || !drugQuantity) {
            return res.status(400).send('Missing required parameters.');
        }
        const result = await CompanyDrugInventory.removeDrugFromInventoryRecord(drugName, drugQuantity, companyId);
        res.json({ message: result });
    } catch (error) {
        console.error('Error removing drug from inventory record:', error);
        res.status(404).json({ error: 'Drug not found' });
    }
};

module.exports = {
    getDrugName,
    getInventoryByDrugName,
    emptyMedicineFromInventory,
    createDrugInventoryRecord,
    removeDrugFromInventoryRecord
};