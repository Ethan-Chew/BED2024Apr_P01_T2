const Joi = require("joi").extend(require('@joi/date'));

const validatePaymentMethod = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string(),
        patientId: Joi.string().required(),
        merchant: Joi.string().required(),
        cardName: Joi.string().required(),
        cardNumber: Joi.string().min(16).max(16).required(),
        cardExpiryDate: Joi.date().format('YYYY-MM').required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validatePaymentMethod;