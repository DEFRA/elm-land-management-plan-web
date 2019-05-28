const fetch = require('node-fetch')
const config = require('../config')

module.exports = {
  plugin: {
    name: 'api',
    register: (server, options) => {
      server.method({
        name: 'api.getJson',
        method: async (action) => {
          const response = await fetch(config.apibase + action)
          return response.json()
        },
        options: {}
      })
    }
  }
}
