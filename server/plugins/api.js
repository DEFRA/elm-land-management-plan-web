const fetch = require('node-fetch')

module.exports = {
  plugin: {
    name: 'api',
    register: (server, options) => {
      server.method({
        name: 'api.getJson',
        method: async (url) => new Promise(async (resolve, reject) => {
          try {
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
