const Joi = require("joi").extend(require('@joi/date'));

const validatePaymentConfirmationEmail = (req, res, next) => {
    const schema = Joi.object({
        recepient: Joi.string().email({ tlds: { allow: false } }).required(),
        paymentAmount: Joi.number().required(),
        cardMerchant: Joi.string().required(),
        cardLFDigits: Joi.string(),
        appointmentDate: Joi.date().format('YYYY-MM-DD').required(),
        appointmentTime: Joi.string().required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
}

module.exports = validatePaymentConfirmationEmail;