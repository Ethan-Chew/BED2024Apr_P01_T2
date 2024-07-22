const Joi = require("joi");

const validateCompanyId = (req, res, next) => {
    const schema = Joi.object({
        companyId: Joi.string().required(),
    });

    const validation = schema.validate(req.params, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
}

module.exports = validateCompanyId;