const getViewModel = require('../../view-models/business/land')
const landService = require('../../services/land-service')

module.exports = {
  method: 'GET',
  path: '/business/{sbi}/land',
  options: {
    handler: async (request, h) => {
      try {
        const { sbi } = request.params

        const parcels = await landService.getParcels(sbi)

        return h.view('business/land', getViewModel({ parcels, sbi }))
      } catch (error) {
        console.error(error)
        return h.view('500')
      }
    }
  }
}
