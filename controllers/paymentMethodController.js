const PaymentMethod = require('../models/paymentMethod');

const getPaymentMethodsByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;

        if (!patientId) {
            res.status(400).json({
                message: "Patient ID is required."
            });
            return;
        }

        const paymentMethods = await PaymentMethod.getPaymentMethodsByPatientId(patientId);

        if (paymentMethods) {
            res.status(200).json({
                message: "Found Payment Methods",
                paymentMethods: paymentMethods
            });
        } else {
            res.status(404).json({
                message: "Payment Methods not found."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const createPaymentMethod = async (req, res) => {
    try {
        const body = req.body;
    } catch (err) {

    }
}

const deletePaymentMethod = async (req, res) => {

}