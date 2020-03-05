const schema = require('../../schemas/claim/property-type')
const sessionHandler = require('../../services/session-handler')
const ViewModel = require('../../models/claim/property-type')

module.exports = [{
  method: 'GET',
  path: '/claim/property-type',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'claim')
      return h.view('claim/property-type', new ViewModel(claim.propertyType, null))
    }
  }
},
{
  method: 'POST',
  path: '/claim/property-type',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('claim/property-type', new ViewModel(request.payload.propertyType, error)).takeover()
      }
    },
    handler: async (request, h) => {
      sessionHandler.update(request, 'claim', request.payload)
      return h.redirect('./accessible')
    }
  }
}]
