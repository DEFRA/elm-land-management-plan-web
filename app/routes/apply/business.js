const Joi = require('@hapi/joi')

const getBusinessViewModel = require('../../view-models/apply/business')
const landService = require('../../services/land-service')

module.exports = {
  method: 'GET',
  path: '/apply/{sbi}',
  options: {
    handler: async (request, h) => {
      const { sbi } = request.params

      const parcels = await landService.getParcels(sbi)

      return h.view('apply/business', getBusinessViewModel({ parcels, sbi }))
    },
    validate: {
      params: Joi.object({
        sbi: Joi.string().pattern(/^\d{9}$/).required()
      })
    }
  }
}
