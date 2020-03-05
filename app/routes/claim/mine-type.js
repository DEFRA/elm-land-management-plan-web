const schema = require('../../schemas/claim/mine-type')
const sessionHandler = require('../../services/session-handler')
const ViewModel = require('../../models/claim/mine-type')

module.exports = [{
  method: 'GET',
  path: '/claim/mine-type',
  options: {
    handler: (request, h) => {
      const claim = sessionHandler.get(request, 'claim')
      return h.view('claim/mine-type', new ViewModel(claim.mineType, null))
    }
  }
},
{
  method: 'POST',
  path: '/claim/mine-type',
  options: {
    validate: {
      payload: schema,
      failAction: async (request, h, error) => {
        return h.view('claim/mine-type', new ViewModel(request.payload.mineType, error)).takeover()
      }
    },
    handler: async (request, h) => {
      sessionHandler.update(request, 'claim', request.payload)
      return h.redirect('./email')
    }
  }
}]
