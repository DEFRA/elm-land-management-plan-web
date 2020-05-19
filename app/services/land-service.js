const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

const config = require('../config')
const restClient = require('../utils/rest-client')

const rpaResponseSchema = Joi.object({
  payload: Joi.object({
    features: Joi.array().required()
  }).required()
})

const getRpaLandServiceUrl = function (entity, sbi) {
  return `${config.rpaLandServiceUrl}/${entity}/MapServer/0/query?where=SBI=${sbi}&outFields=*&f=geojson`
}

const landService = {
  async getParcels (sbi) {
    const landParcelsUrl = getRpaLandServiceUrl('LandParcels', sbi)
    let rpaResponse

    try {
      rpaResponse = await restClient.get(landParcelsUrl)
    } catch (error) {
      throw Boom.failedDependency('RPA Land Service failed to serve parcel data for the requested SBI')
    }

    if (rpaResponseSchema.validate(rpaResponse).error) {
      throw Boom.failedDependency('RPA Land Service gave an invalid response')
    }

    if (rpaResponse.payload.features.length === 0) {
      throw Boom.notFound('No parcel data found for requested SBI')
    }

    return rpaResponse.payload.features.map(parcel => ({
      parcelId: parcel.properties.parcel_id,
      hectares: parcel.properties.area_ha
    }))
  }
}

module.exports = landService
