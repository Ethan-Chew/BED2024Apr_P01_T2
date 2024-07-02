const Joi = require("joi");

const validateAppointment = (req, res, next) => {
    const schema = Joi.object({
        patientId: Joi.string().length(7).required(),
        slotId: Joi.string().length(7).required(),
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