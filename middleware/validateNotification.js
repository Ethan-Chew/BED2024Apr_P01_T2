const Joi = require("joi").extend(require('@joi/date'));

const validateNotification = (req, res, next) => {
    const schema = Joi.object({
        senderId: Joi.string().required(),
        receiverId: Joi.string().required(),
        message: Joi.string().required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validateNotification;