const config = require('../config')
const restClient = require('./rest-client')
const sessionHandler = require('./session-handler')

module.exports = {
  submit: async (request) => {
    try {
      const claim = sessionHandler.get(request, 'claim')
      console.log('submitting claim')
      console.log(claim)
      await restClient.postJson(`${config.apiGateway}/claim`, { payload: claim })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
