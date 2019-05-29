const request = require('request-promise-native')
const config = require('../config')

module.exports = {
  plugin: {
    name: 'api',
    register: (server, options) => {
      server.method({
        name: 'api.get',
        method: async (action) => {
          return await request({
            json: true,
            uri: config.apibase + action
          })
        },
        options: {}
      })
    }
  }
}
