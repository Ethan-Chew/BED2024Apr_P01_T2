const Joi = require("joi").extend(require('@joi/date'));

const validateAddRequestContribution = (req, res, next) => {
    const schema = Joi.object({
        appointmentId: Joi.string().required(),
        drugName: Joi.string().required(),
        quantity: Joi.number().required(),
        totalCost: Joi.number().required(),
        contributeDate: Joi.date().format('YYYY-MM-DD').required(),
        contributionStatus: Joi.string().required(),
        companyId: Joi.string().required(),
        drugRecordId: Joi.string().required()
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const error = new Joi.ValidationError(validation.error.details);
        res.status(400).json({ message: "Validation error", error: error.message });
        return;
    }

    next();
};

module.exports = validateAddRequestContribution;