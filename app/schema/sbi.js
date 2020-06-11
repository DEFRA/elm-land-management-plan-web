const Joi = require('@hapi/joi')

module.exports = Joi.string().pattern(/^\d{9}$/).required()
