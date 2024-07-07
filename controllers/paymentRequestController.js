const PaymentRequest = require('../models/paymentRequest');

// Emmanuel
const createPaymentRequest = async (req, res) => {
    try {
        const { appointmentId, message, createdDate } = req.body;

        if (!appointmentId || !message || !createdDate) {
            return res.status(400).json({ message: 'appointmentId, message and createdDate are required' });
        }

        const createRequest = await PaymentRequest.createPaymentRequest(appointmentId, message, createdDate)

        if (!createRequest) {
            res.status(500).json({
                message: `Failed to create Payment Request.`
            });
            return;
        } else {
            res.status(201).json({
                status: "Success",
                message: "Payment request created",
                paymentRequest: createRequest

            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const cancelPaymentRequest = async (req, res) => {
    try {
        const { id } = req.params

        if (id === undefined) {
            return res.status(400).json({ message: 'Payment Request Id is required' })
        }

        const deleteRequest = await PaymentRequest.cancelPaymentRequestById(id);
        console.log("Controller response: ", deleteRequest)
        if (deleteRequest) {
            res.status(201).json({
                status: "Success",
                message: "Payment request deleted"
            })
        } else {
            res.status(404).json({
                status: "Error",
                message: "Payment request does not exist or status is Rejected"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

const getPaymentRequestByAppointmentId = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        // console.log(appointmentId);

        if (appointmentId === undefined) {
            return res.status(400).json({ message: 'Appointment Id is required' });
        }

        const getRequest = await PaymentRequest.getPaymentRequestByAppointmentId(appointmentId);

        if (getRequest) {
            res.status(200).json({
                status: "Success",
                message: "Payment request returned",
                paymentRequest: getRequest
            })
        } else {
            res.status(404).json({
                status: "Failed",
                message: "Payment request does not exist"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createPaymentRequest,
    cancelPaymentRequest,
    getPaymentRequestByAppointmentId
};