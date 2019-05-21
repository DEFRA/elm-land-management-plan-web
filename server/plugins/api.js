const fetch = require('node-fetch')
const config = require('../config')

module.exports = {
  plugin: {
    name: 'api',
    register: (server, options) => {
      server.method({
        name: 'api.getJson',
        method: async (action) => new Promise(async (resolve, reject) => {
          try {
            const url = config.apibase + action
            const response = await fetch(url)
            resolve(await response.json())
          } catch (error) {
            reject(error)
          }
        }),
        options: {}
      })
    }
  }
}
