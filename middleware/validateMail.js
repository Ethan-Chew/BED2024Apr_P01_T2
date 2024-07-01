const Joi = require("joi");

const validatePaymentConfirmationMail = (req, res, next) => {
    const schema = Joi.object({
        appointmentId: Joi.string().length(7).required(),
        paymentDetails: Joi.object({
            
        }).required()
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
}

module.exports = validateMakePayment;