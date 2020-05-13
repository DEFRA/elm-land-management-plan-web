const getBusinessViewModel = require('../../view-models/apply/business')
const landService = require('../../services/land-service')

module.exports = {
  method: 'GET',
  path: '/apply/{sbi}',
  options: {
    handler: async (request, h) => {
      try {
        const { sbi } = request.params

        const parcels = await landService.getParcels(sbi)

        return h.view('apply/business', getBusinessViewModel({ parcels, sbi }))
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    }
  }
}
