const apiGateway = require('../../services/api-gateway')
const idService = require('../../services/id-service')
const schema = require('../../schemas/claim/email')
const sessionHandler = require('../../services/session-handler')
const ViewModel = require('../../models/claim/email')

module.exports = [{
  method: 'GET',
  path: '/claim/email',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'claim')
      return h.view('claim/email', new ViewModel(claim.email, null))
    }
  }
},
{
  method: 'POST',
  path: '/claim/email',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('claim/email', new ViewModel(request.payload.email, error)).takeover()
      }
    },
    handler: async (request, h) => {
      const claim = sessionHandler.get(request, 'claim')

      // TODO refactor to safely handle clearing of cache when no longer needed and add more robus generation logic for unique Id
      if (!claim.submitted) {
        request.payload.claimId = idService.generateId()
        sessionHandler.update(request, 'claim', request.payload)
        const submitted = await apiGateway.submit(request)
        if (!submitted) {
          console.log('claim submission failed')
          return h.view('service-unavailable')
        }
        request.payload.submitted = true
        sessionHandler.update(request, 'claim', request.payload)
      }
      return h.redirect('./confirmation')
    }
  }
}]
