const schema = require('../../schemas/claim/accessible')
const sessionHandler = require('../../services/session-handler')
const ViewModel = require('../../models/claim/accessible')

module.exports = [{
  method: 'GET',
  path: '/claim/accessible',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'claim')
      return h.view('claim/accessible', new ViewModel(claim.accessible, null))
    }
  }
},
{
  method: 'POST',
  path: '/claim/accessible',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('claim/accessible', new ViewModel(request.payload.accessible, error)).takeover()
      }
    },
    handler: async (request, h) => {
      sessionHandler.update(request, 'claim', request.payload)
      return h.redirect('./date-of-subsidence')
    }
  }
}]
