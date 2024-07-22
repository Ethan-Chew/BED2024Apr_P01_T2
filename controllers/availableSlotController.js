const availableSlot = require("../models/availableSlot");
const appointment = require("../models/appointment");
const slotTime = require("../models/slotTime");

// Emmanuel //
const createAvailableSlot = async (req, res) => {
    try {
        const { doctorId, slotDate, slotTimeId } = req.body;

        if (!doctorId || !slotDate || !slotTimeId) {
            return res.status(400).json({
                status: "Error",
                message: 'Doctor Id, slotDate and slotTimeId are'
            });
        }

        const createRequest = availableSlot.createAvailableSlot(doctorId, slotDate, slotTimeId);

        if (createRequest) {
            res.status(201).json({
                status: "Success",
                message: "Available slot created",
                availableSlot: createRequest
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const updateAvailableSlotById = async (req, res) => {
    try {
        const { slotId } = req.params;

        if (!slotId) {
            return res.status(400).json({
                status: "Error",
                message: 'Slot ID is required'
            });
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

// Emmanuel
const getAllAvailableSlotsTimesByDate = async (req, res) => {
    try {
        const { date } = req.params;

        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const dateTimeSlots = await availableSlot.getAllAvailableSlotsDateTimes(date);

        if (dateTimeSlots) {
            let timeSlots = [];
            for (i = 0; i < dateTimeSlots.length; i++) {
                timeSlots.push(dateTimeSlots[i].SlotTime)
            }
            res.status(200).json({
                message: "Available Slots Returned Successfully",
                dateTimeSlots: timeSlots
            });
        } else {
            res.status(404).json({
                message: "No available time slots"
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const getAvailableSlotByDateAndTime = async (req, res) => {
    try {
        const { date, time } = req.body;

        if (!date || !time) {
            return res.status(400).send({ message: 'Date and Time are required' });
        }

        const avSlot = await availableSlot.getAvailableSlotByDateAndTime({ date: date, time: time })

        if (avSlot) {
            res.status(200).json({
                message: "Available Slot returned Successfully",
                availableSlot: avSlot
            });
        } else {
            res.status(404).json({
                message: "Failed to get Available Slot, Available Slot does not exist"
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    updateAvailableSlotById,
    getAllAvailableSlotsTimesByDate,
    getAvailableSlotByDateAndTime,
    createAvailableSlot
}