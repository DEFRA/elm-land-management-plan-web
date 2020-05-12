const config = require('../config')
const restClient = require('../utils/rest-client')

const getRpaLandServiceUrl = function (entity, sbi) {
  return `${config.rpaLandServiceUrl}/${entity}/MapServer/0/query?where=SBI=${sbi}&outFields=*&f=geojson`
}

const landService = {
  async getParcels (sbi) {
    const landParcelsUrl = getRpaLandServiceUrl('LandParcels', sbi)

    const response = await restClient.get(landParcelsUrl)

    return response.payload.features.map(parcel => ({
      parcelId: parcel.properties.parcel_id,
      hectares: parcel.properties.area_ha
    }))
  }
}

module.exports = landService
