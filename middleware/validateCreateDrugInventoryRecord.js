const Joi = require('joi').extend(require('@joi/date'));

const validateCreateDrugInventoryRecord = (req, res, next) => {
    const schema = Joi.object({
        drugName: Joi.string().required(),
        drugExpiryDate: Joi.date().format('YYYY-MM-DD').required(),
        drugQuantity: Joi.number().required(),
        companyId: Joi.string().required()
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const error = new Joi.ValidationError(validation.error.details);
        res.status(400).json({ message: "Validation error", error: error.message });
        return;
    }

    next();
}

module.exports = validateCreateDrugInventoryRecord;