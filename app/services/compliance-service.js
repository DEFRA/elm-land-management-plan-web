const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const complianceData = require('../data/compliance.json')
const config = require('../config')
const restClient = require('../utils/rest-client')

const existingSchemesSchema = Joi.array().items(Joi.object({
  schemeId: Joi.string().required(),
  dateStart: Joi.date().required(),
  dateEnd: Joi.date().required()
}).unknown())

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
          headers: {
            statusCode: 200
          },
          payload: complianceData[sbi] || []
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
    if (existingSchemesNotFound || complianceResponse.headers.statusCode === 204) {
      responsePayload = []
    } else {
      responsePayload = complianceResponse.payload
    }

    const complianceResponseValidation = existingSchemesSchema.validate(responsePayload)
    if (complianceResponseValidation.error) {
      throw Boom.failedDependency(`Compliance Service gave an invalid response: ${complianceResponseValidation.error}`)
    }

    return responsePayload.map(getRequiredSchemeProperties)
  }
}

module.exports = landService
