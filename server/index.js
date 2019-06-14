const hapi = require('hapi')
const config = require('./config')
const plugins = require('./plugins')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(plugins.universal)

  if (config.isDev) {
    await server.register(plugins.development)
  }

  return server
}

module.exports = createServer
