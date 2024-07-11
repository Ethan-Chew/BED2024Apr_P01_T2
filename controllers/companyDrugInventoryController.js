const CompanyDrugInventory = require('../models/companyDrugInventoryModel');

const getDrugName = async (req, res) => {
    try {
        const drugName = await CompanyDrugInventory.getDrugName();
        res.json(drugName);
    } catch (error) {
        console.error('Error fetching medicine name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getInventoryByDrugName = async (req, res) => {
    try {
        const { companyId, drugName } = req.params;
        const drugInfo = await CompanyDrugInventory.getInventoryByDrugName(drugName, companyId);
        res.json(drugInfo);
    } catch (error) {
        console.error('Error fetching medicine information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const emptyMedicineFromInventory = async (req, res) => {
    try {
        const { companyId, drugName } = req.params;
        const message = await CompanyDrugInventory.emptyMedicineFromInventory(drugName, companyId);
        res.json({ message });
    } catch (error) {
        console.error('Error emptying medicine from inventory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const createDrugInventoryRecord = async (req, res) => {
    try {
        const { drugName, drugExpiryDate, drugQuantity, companyId } = req.body;
        const result = await CompanyDrugInventory.createDrugInventoryRecord(drugName, drugExpiryDate, drugQuantity, companyId);
        res.json({ message: result });
    } catch (error) {
        console.error('Error creating drug inventory record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

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
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getDrugName,
    getInventoryByDrugName,
    emptyMedicineFromInventory,
    createDrugInventoryRecord,
    removeDrugFromInventoryRecord
};