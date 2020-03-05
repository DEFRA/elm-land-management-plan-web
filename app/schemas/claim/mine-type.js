const Joi = require('@hapi/joi')

module.exports = Joi.object({
  mineType: Joi.array().single().items(
    Joi.any().valid('gold', 'coal', 'iron', 'other')
  )
})
