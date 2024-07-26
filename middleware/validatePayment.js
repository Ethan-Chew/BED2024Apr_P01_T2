const Joi = require("joi").extend(require('@joi/date'));

const validatePayment = (req, res, next) => {
    const schema = Joi.object({
        appointmentId: Joi.string(),
        paymentMethod: Joi.string().valid('DWallet', 'Card', 'PayRequest').required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validatePayment;