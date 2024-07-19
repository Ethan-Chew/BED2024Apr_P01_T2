// Model Created by: Jefferson
const InventoryRecord = require('../models/inventoryRecordModel');

const getInventoryRecordByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.params;

        const inventoryRecord = await InventoryRecord.getInventoryRecordByCompanyId(companyId);

        if (req.user.id !== companyId) {
            res.status(403).json({
                status: "Forbidden",
                message: "You are not allowed to view the inventory record."
            });
            return;
        }

        res.json(inventoryRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteDrugRecordByRecordId = async (req, res) => {
    try {
        const { drugRecordId } = req.params;
        if (!drugRecordId || typeof drugRecordId!== 'string') {
            return res.status(400).json({ message: 'Invalid record ID' });
        }

        const result = await InventoryRecord.deleteDrugRecordByRecordId(drugRecordId);
        res.json({ message: 'Record deleted successfully', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const updateDrugQuantityByRecordId = async (req, res) => {
    try {
        const { drugRecordId } = req.params;
        if (!drugRecordId || typeof drugRecordId!== 'string') {
            return res.status(400).json({ message: 'Invalid record ID' });
        }

        const result = await InventoryRecord.updateDrugQuantityByRecordId(drugRecordId);
        res.json({ message: 'Quantity updated successfully', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getInventoryRecordByCompanyId,
    deleteDrugRecordByRecordId,
    updateDrugQuantityByRecordId
};