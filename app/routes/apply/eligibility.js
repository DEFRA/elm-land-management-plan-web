const Joi = require('@hapi/joi')

const businesses = require('../../data/businesses.json')
const complianceService = require('../../services/compliance-service')
const getEligibilityViewModel = require('../../view-models/apply/eligibility')
const sbiSchema = require('../../schema/sbi')

module.exports = {
  method: 'GET',
  path: '/apply/businesses/{sbi}/eligibility',
  options: {
    handler: async (request, h) => {
      try {
        const { sbi } = request.params
        const business = businesses.filter(item => item.sbi === sbi)[0]
        const today = new Date().toISOString().slice(0, 10)
        const existingSchemes = await complianceService.getExistingSchemes(sbi, today)

        return h.view('apply/eligibility', getEligibilityViewModel({ business, existingSchemes }))
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    },
    validate: {
      params: Joi.object({
        sbi: sbiSchema
      })
    }
  }
}
