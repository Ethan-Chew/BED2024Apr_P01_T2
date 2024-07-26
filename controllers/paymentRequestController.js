const PaymentRequest = require('../models/paymentRequest');
const PrescribedMedication = require('../models/prescribedMedication')
const Payment = require('../models/payment')
// Emmanuel
const createPaymentRequest = async (req, res) => {
    try {
        const { appointmentId, message, createdDate } = req.body;

        if (!appointmentId || !message || !createdDate) {
            return res.status(400).json({ message: 'appointmentId, message and createdDate are required' });
        }

        const createRequest = await PaymentRequest.createPaymentRequest(appointmentId, message, createdDate)

        if (!createRequest) {
            return res.status(500).json({
                message: `Failed to create Payment Request.`
            });
            return;
        } else {
            return res.status(201).json({
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
        // console.log("Controller response: ", deleteRequest)
        if (deleteRequest) {
            return res.status(201).json({
                status: "Success",
                message: "Payment request deleted"
            })
        } else {
            return res.status(404).json({
                status: "Error",
                message: "Payment request does not exist or status is Rejected"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const getPaymentRequestByAppointmentId = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        // console.log(appointmentId);

        if (appointmentId === undefined) {
            return res.status(400).json({ message: 'Appointment Id is required' });
        }

        const getRequest = await PaymentRequest.getPaymentRequestByAppointmentId(appointmentId);

        if (getRequest) {
            return res.status(200).json({
                status: "Success",
                message: "Payment request returned",
                paymentRequest: getRequest
            })
        } else {
            return res.status(404).json({
                status: "Failed",
                message: "Payment request does not exist"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const getPaymentRequestsByApprovedStatus = async (req, res) => {
    try {

        const getRequests = await PaymentRequest.getPaymentRequestsByApprovedStatus();

        if (getRequests) {
            return res.status(200).json({
                status: "Success",
                message: "Payment requests returned",
                paymentRequests: getRequests
            })
        } else {
            return res.status(404).json({
                status: "Failed",
                message: "Payment requests do not exist"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const getPaymentRequestStatusByPendingDrugRequest = async (req, res) => {
    try {
        const getRequests = await paymentRequest.getPaymentRequestStatusByPendingDrugRequest();

        if (getRequests) {
            return res.status(200).json({
                status: "Success",
                message: "Payment requests returned",
                paymentRequests: getRequests
            })
        } else {
            return res.status(404).json({
                status: "Failed",
                message: "Payment requests do not exist"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const approvePaymentRequestByAppointmentId = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const status = 'Approved';
        const pmStatus = 'Pending';

        if (appointmentId === undefined) {
            return res.status(400).json({ message: 'Appointment Id is required' });
        }

        const approveRequest = await PaymentRequest.updatePaymentRequestStatusByAppointmentId(appointmentId, status);
        const updatedPrescribedMed = await PrescribedMedication.updatePrescribedMedicationDrugRequestByAppointmentId(appointmentId, pmStatus);
        // const updatePayment = await Payment.updatePaymentStatus

        if (approveRequest) {
            return res.status(200).json({
                status: "Success",
                message: "Payment request approved successfuly",
                paymentRequest: approveRequest
            })
        } else {
            return res.status(404).json({
                status: "Failed",
                message: "failed to approve as payment request does not exist"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const rejectPaymentRequestByAppointmentId = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const status = 'Rejected';
        const pmStatus = 'Cancelled';

        if (appointmentId === undefined) {
            return res.status(400).json({ message: 'Appointment Id is required' });
        }

        const rejectRequest = await PaymentRequest.updatePaymentRequestStatusByAppointmentId(appointmentId, status);
        const updatedPrescribedMed = await PrescribedMedication.updatePrescribedMedicationDrugRequestByAppointmentId(appointmentId, pmStatus)

        if (rejectRequest) {
            return res.status(200).json({
                status: "Success",
                message: "Payment request rejected successfuly",
                paymentRequest: rejectRequest
            })
        } else {
            return res.status(404).json({
                status: "Failed",
                message: "failed to reject as payment request does not exist"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }

}

// Emmanuel
const payRequestByRequestId = async (req, res) => {
    try {
        const { paymentRequestId, amount } = req.body;

        if (paymentRequestId === undefined) {
            return res.status(400).json({ message: 'paymentRequestId Id is required' });
        }

        const payPaymentRequest = PaymentRequest.payPaymentRequestByRequestId(paymentRequestId, amount);

        if (payPaymentRequest) {

            return res.status(200).json({
                status: "Success",
                message: "Payment request paid successfuly",
            })
        } else {
            return res.status(404).json({
                status: "Failed",
                message: "failed to pay as payment request does not exist"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const fulfillRequestByRequestId = async (req, res) => {
    try {
        const { paymentRequestId } = req.params;

        if (paymentRequestId === undefined) {
            return res.status(400).json({ message: 'paymentRequestId Id is required' });
        }

        const fulfillRequest = PaymentRequest; // WIP

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}

// Emmanuel
const checkPaymentRequest = async (req, res) => {
    try {
        const paymentRequests = await PaymentRequest.getPaymentRequestsBeforeToday();

        if (paymentRequests) {
            const status = 'Cancelled';
            // console.log(paymentRequests);
            for (i = 0; i < paymentRequests.length; i++) {
                // console.log(paymentRequests[i].AppointmentId);
                const updatePrescribeMed = await PrescribedMedication.updatePrescribedMedicationDrugRequestByAppointmentId(paymentRequests[i].AppointmentId, status);
            }
            return res.status(200).json({
                status: "Success",
                message: "Prescribed Med updated successfuly",
            })
        } else {
            return res.status(404).json({
                status: "Failed",
                message: "Failed to access Payment Requests"
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
    getPaymentRequestByAppointmentId,
    getPaymentRequestStatusByPendingDrugRequest,
    approvePaymentRequestByAppointmentId,
    rejectPaymentRequestByAppointmentId,
    getPaymentRequestsByApprovedStatus,
    payRequestByRequestId,
    checkPaymentRequest
};