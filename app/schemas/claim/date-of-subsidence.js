const Joi = require('@hapi/joi')

module.exports = Joi.object().required().keys({
  day: Joi.number().required().min(1).max(31),
  month: Joi.number().required().min(1).max(12),
  year: Joi.number().required()
})
