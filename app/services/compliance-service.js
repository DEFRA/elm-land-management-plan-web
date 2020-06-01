const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const complianceData = require('../data/compliance.json')
const config = require('../config')
const restClient = require('../utils/rest-client')

const existingSchemesSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    schemeId: Joi.string().required(),
    dateStart: Joi.date(),
    dateEnd: Joi.date()
  }).unknown())
})

function getRequiredSchemeProperties ({ schemeId, dateStart, dateEnd }) {
  return { schemeId, dateStart, dateEnd }
}

const landService = {
  async getExistingSchemes (sbi, date) {
    const existingSchemesUrl = `${config.complianceServiceUrl}/schemes/${sbi}?date=${date}`
    let complianceResponse
    let existingSchemesNotFound = false

    try {
      // TEMPORARY HACK TO TEST UI. REMOVE SWITCH AND USE ONLY THE restClient.get LINE ONCE COMPLIANCE SERVICE IS AVAILABLE
      if (process.env.STUB_COMPLIANCE_SERVICE === 'true') {
        complianceResponse = {
          res: {
            statusCode: 200
          },
          payload: {
            items: complianceData[sbi] || []
          }
        }
      } else {
        complianceResponse = await restClient.get(existingSchemesUrl)
      }
    } catch (error) {
      if (error.isBoom && error.output.statusCode === 404) {
        existingSchemesNotFound = true
      } else {
        throw Boom.failedDependency('Compliance Service failed to serve existing schemes data for the requested SBI')
      }
    }

    let responsePayload
    if (existingSchemesNotFound || complianceResponse.res.statusCode === 204) {
      responsePayload = { items: [] }
    } else {
      responsePayload = complianceResponse.payload
    }

    const complianceResponseValidation = existingSchemesSchema.validate(responsePayload)
    if (complianceResponseValidation.error) {
      throw Boom.failedDependency(`Compliance Service gave an invalid response: ${complianceResponseValidation.error}`)
    }

    return responsePayload.items.map(getRequiredSchemeProperties)
  }
}

module.exports = landService
