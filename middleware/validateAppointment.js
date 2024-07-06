const Joi = require("joi").extend(require('@joi/date'));

const validateAppointment = (req, res, next) => {
    const schema = Joi.object({
        patientId: Joi.string().length(7).required(),
        slotDate: Joi.date().format('YYYY-MM-DD').required(),
        slotTime: Joi.string().required(),
        reason: Joi.string().required(),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validateAppointment;