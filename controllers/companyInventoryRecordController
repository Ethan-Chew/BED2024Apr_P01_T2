const InventoryRecord = require('../models/companyInventoryRecordModel');

const getInventoryRecordByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;

        const inventoryRecord = await InventoryRecord.getInventoryRecordByCompanyId(companyId);
        res.json(inventoryRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteDrugRecordByRecordId = async (req, res) => {
    try {
        const { recordId } = req.params;

        const result = await InventoryRecord.deleteDrugRecordByRecordId(recordId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const updateDrugQuantityByRecordId = async (req, res) => {
    try {
        const { recordId } = req.params;

        const result = await InventoryRecord.updateDrugQuantityByRecordId(recordId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getInventoryRecordByCompanyId,
    deleteDrugRecordByRecordId,
    updateDrugQuantityByRecordId
};