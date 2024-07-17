const Joi = require('joi');

const validateConfirmDrugOrder = (req, res, next) => {
    const schema = Joi.object({
        appointmentId: Joi.string().required(),
        drugName: Joi.string().required()
    });

    const validation = schema.validate(req.params, { abortEarly: false });

    if (validation.error) {
        const error = new Joi.ValidationError(validation.error.details);
        res.status(400).json({ message: "Validation error", error: error.message });
        return;
    }

    next();
}

module.exports = validateConfirmDrugOrder;