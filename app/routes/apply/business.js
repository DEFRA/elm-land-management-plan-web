const Joi = require('@hapi/joi')

const complianceService = require('../../services/compliance-service')
const getBusinessViewModel = require('../../view-models/apply/business')
const landService = require('../../services/land-service')

module.exports = {
  method: 'GET',
  path: '/apply/businesses/{sbi}',
  options: {
    handler: async (request, h) => {
      const { sbi } = request.params

      const today = new Date().toISOString().slice(0, 10)
      const existingSchemes = await complianceService.getExistingSchemes(sbi, today)
      const parcels = await landService.getParcels(sbi)

      return h.view('apply/business', getBusinessViewModel({ existingSchemes, parcels, sbi }))
    },
    validate: {
      params: Joi.object({
        sbi: Joi.string().pattern(/^\d{9}$/).required()
      })
    }
  }
}
