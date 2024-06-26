const Payment = require("../models/payment");

const removePayment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;


    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}