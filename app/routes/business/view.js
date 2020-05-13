const getBusinessViewModel = require('../../view-models/business/view')
const landService = require('../../services/land-service')

module.exports = {
  method: 'GET',
  path: '/business/{sbi}',
  options: {
    handler: async (request, h) => {
      try {
        const { sbi } = request.params

        const parcels = await landService.getParcels(sbi)

        return h.view('business/view', getBusinessViewModel({ parcels, sbi }))
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    }
  }
}
