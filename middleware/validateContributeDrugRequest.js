const Joi = require("joi");

const validateContributeDrugRequest = (req, res, next) => {
    const schema = Joi.object({
        companyId: Joi.string().required(),
        appointmentId: Joi.string().required(),
        drugName: Joi.string().required(),
        contributedQuantity: Joi.number().required()
    });

    const validation = schema.validate({ ...req.params, ...req.body }, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validateContributeDrugRequest;