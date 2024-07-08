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

module.exports = {
    getDrugName
};