const DrugInventory = require("../models/drugInventory");

const getDrugInventory = async (req, res) => {
    try {

        const inventory = await DrugInventory.getDrugInventory();

        if (!inventory) {
            res.status(404).json({
                message: `inventory not found.`
            });
            return;
        }

        res.status(200).json({
            message: "inventory Found",
            inventory: inventory
        });
        
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getDrugInventory,
}