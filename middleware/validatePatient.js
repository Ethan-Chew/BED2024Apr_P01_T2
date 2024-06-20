const Joi = require("joi").extend(require('@joi/date'));

const validatePatient = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        password: Joi.string(),
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        knownAllergies: Joi.string().required(),
        birthdate: Joi.date().format('YYYY-MM-DD').required(), // UNIX Time
        qns: Joi.object({
            qOne: Joi.string().required(),
            qTwo: Joi.string().required(),
            qThree: Joi.string().required(),
            qFour: Joi.string().required(),
            qFive: Joi.string().required(),
            qSix: Joi.string().required(),
        }),
    });

    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        res.status(400).json({ message: "Validation error", errors });
        return;
    }

    next();
};

module.exports = validatePatient;