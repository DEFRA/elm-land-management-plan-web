const hapi = require('@hapi/hapi')
const config = require('./config')
const catbox = config.isTest ? require('@hapi/catbox-memory') : require('@hapi/catbox-redis')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      // },
      // cache: {
      //   otherwise: 'no-cache, must-revalidate, max-age=0, no-store'
      }
    },
    cache: [{
      name: config.cacheName,
      provider: {
        constructor: catbox,
        options: {
          host: config.redisHost,
          port: config.redisPort,
          partition: 'mine-support'
        }
      }
    }]
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/session-cache'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  return server
}

module.exports = createServer
