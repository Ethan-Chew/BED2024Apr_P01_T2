const Joi = require('joi');

const validateUpdateDrugQuantityByRecordId = async (req, res, next) => {
  const schema = Joi.object({
    drugRecordId: Joi.string().required(),
  });

  const validation = schema.validate(req.params);

  if (validation.error) {
    return res.status(400).json({ message: 'Validation error', error: validation.error.details });
  }

  next();
};

module.exports = validateUpdateDrugQuantityByRecordId;