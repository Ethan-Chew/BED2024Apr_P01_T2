const Joi = require("joi");

const validateReturnMedicine = (req, res, next) => {
    const paramsSchema = Joi.object({
        drugRecordId: Joi.string().required()
    });

    const bodySchema = Joi.object({
        appointmentId: Joi.string().required(),
        drugName: Joi.string().required()
    });

    const paramsValidation = paramsSchema.validate(req.params, { abortEarly: false });
    const bodyValidation = bodySchema.validate(req.body, { abortEarly: false });

    if (paramsValidation.error || bodyValidation.error) {
        const errors = [
            (paramsValidation.error ? paramsValidation.error.details : []),
            (bodyValidation.error ? bodyValidation.error.details : [])
        ];
        res.status(400).json({ message: "Validation error", error: errors.map(e => e.message).join(", ") });
        return;
    }

    next();
}

module.exports = validateReturnMedicine;