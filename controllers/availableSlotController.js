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
            res.status(200).json({
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

const getAllAvailableSlotsTimesByDate = async (req,res) => {
    try {
        const { date } = req.params;

        if (!date) {
            return res.status(400).send({ message: 'Date is required' });
        }

        const DateTimeSlots = await availableSlot.getAllAvailableSlotsDateTimes(date);


        if (DateTimeSlots) {
            res.status(200).json({
                message: "Available Slots Returned Successfully",
            });
        } else {
            res.status(500).json({
                message: "Failed to get Available Slots"
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    updateAvailableSlotById,
    getAllAvailableSlotsTimesByDate
}