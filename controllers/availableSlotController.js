const availableSlot = require("../models/availableSlot");
const appointment = require("../models/appointment");
const slotTime = require("../models/slotTime");

const updateAvailableSlotById = async (req, res) => {
    try {
        const { slotId } = req.params;

        if (!slotId) {
            return res.status(400).send({ message: 'Slot ID is required' });
        }

        const { doctorId, date, time } = req.body;

        const timeId = await slotTime.getSlotTimeIdByTime(time);

        const updateDateTime = await availableSlot.updateAvailableSlot(slotId, {
            doctor: doctorId,
            date: date,
            timeId: timeId,
        });

        if (updateDateTime) {
            res.status(201).json({
                message: "Available Slot Updated Successfully",
            });
        } else {
            res.status(500).json({
                message: "Failed to Update Available Slot"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    updateAvailableSlotById
}