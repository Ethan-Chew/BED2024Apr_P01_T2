const Joi = require("joi");

const validateCancelDrugOrder = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        drugName: Joi.string().required()
    });

    const validation = schema.validate(req.params, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
}

module.exports = validateCancelDrugOrder;