const Joi = require('@hapi/joi')

module.exports = Joi.object({
  propertyType: Joi.any().required().valid('home', 'business')
})
