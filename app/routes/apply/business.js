const Joi = require('@hapi/joi')

const businesses = require('../../data/businesses.json')
const complianceService = require('../../services/compliance-service')
const getBusinessViewModel = require('../../view-models/apply/business')
const landService = require('../../services/land-service')
const sbiSchema = require('../../schema/sbi')

module.exports = {
  method: 'GET',
  path: '/apply/businesses/{sbi}',
  options: {
    handler: async (request, h) => {
      const { sbi } = request.params
      const business = businesses.filter(item => item.sbi === sbi)[0]
      const today = new Date().toISOString().slice(0, 10)
      const existingSchemes = await complianceService.getExistingSchemes(sbi, today)
      const parcels = await landService.getParcels(sbi)

      return h.view('apply/business', getBusinessViewModel({ business, existingSchemes, parcels }))
    },
    validate: {
      params: Joi.object({
        sbi: sbiSchema
      })
    }
  }
}
