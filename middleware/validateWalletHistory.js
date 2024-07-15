const Joi = require("joi").extend(require('@joi/date'));

const validateWalletHistory = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        amount: Joi.number().required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validateWalletHistory;